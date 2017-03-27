import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    Button,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { Card, CardSection } from './common';
import { fetchWeek, selectDay } from '../actions';
import { SPECIAL_SUBJECTS } from '../actions/defaults';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import ListItem from './ListItemComponent';

class DayView extends Component {
    componentWillMount() {
        this.createDataSource(this.props);
    }

    componentDidMount() {
        Actions.refresh({key: 'timetable', title: i18n.t('day_view')});
    }

    componentWillReceiveProps(nextProps) {
        this.createDataSource(nextProps);
    }

    _onRefresh() {
        this.props.fetchWeek(this.props.user, this.props.program, this.props.currentWeek, this.props.semester);
    }

    createDataSource({ events }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        if (events.length === 0) {
            this.dataSource = ds.cloneWithRows([{ noEvents: true }]);
        } else {
            this.dataSource = ds.cloneWithRows(events);
        }
    }

    renderRow(eventJSON) {
        let masterdataJSON = JSON.parse(this.props.masterdata);
        let eventName;
        let eventShortname;
        let eventRoom;
        let eventLecturers = [];
        let eventNote;
        let eventSlot;

        if (eventJSON.noEvents) {
            return (
                <Card>
                    <CardSection style={styles.noEventsCardSection}>
                        <Text style={styles.noEventsText}>{i18n.t('no_events')}</Text>
                    </CardSection>
                </Card>
            );
        } else {
            eventName = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["name"];
            eventShortname = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["shortname"];

            let special_subjectProgram = SPECIAL_SUBJECTS[this.props.program];
            let special_subjectRegEx = '';
            for (let special_subject in special_subjectProgram) {
                special_subjectRegEx += `(${special_subjectProgram[special_subject]["shortname"].toUpperCase()})`;
                if ((parseInt(special_subject) + 1) !== special_subjectProgram.length) {  // Check if it's NOT the last iteration
                    special_subjectRegEx += '|'
                }
            }
            special_subjectRegEx = new RegExp(special_subjectRegEx);

            if (
                !special_subjectRegEx.test(eventShortname) ||  // If the 'event' is not a 'special_subject'
                this.props.special_subject === 'all' ||  // If a user chose to see all 'special_subjects'
                this.props.program + this.props.semester !== this.props.user ||  // If the user changed their default semester
                this.props.special_subject !== 'all' && eventShortname.includes(this.props.special_subject.toUpperCase())  // If they chose a 'special_subject' and the 'event' is one of the kind
            ) {
                eventRoom = eventJSON["rooms"][0];
                for (let lecturer in eventJSON["lecturers"]) {
                    eventLecturers.push(_.get(masterdataJSON["persons"], eventJSON["lecturers"][lecturer])["name"]);
                }
                eventLecturers = JSON.stringify(eventLecturers);
                eventNote = eventJSON["note"];
                eventSlot = eventJSON["slot"];

                return <ListItem eventName={eventName} eventRoom={eventRoom} eventLecturers={eventLecturers} eventNote={eventNote} eventSlot={eventSlot} />;
            } else {
                return null
            }
        }
    }

    render() {
        return (
            <View style={[styles.flex, { paddingBottom: 55 }]}>
                <ListView
                    enableEmptySections
                    dataSource={this.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh.bind(this)}
                            colors={['#E10019']}
                            tintColor="#E10019"
                        />
                    }
                    style={styles.flex}
                />
            </View>
        );
    }
}

i18n.locale = 'de';
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        height: 60,
        padding: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    headerView: {
        flexDirection: "column",
        alignItems: "center"
    },
    noEventsCardSection: {
        height: 235,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    noEventsText: {
        fontSize: 28,
        fontWeight: "bold"
    },
    flex: {
        flex: 1
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        masterdata: state.timetable.masterdata,
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay,
        semester: state.settings.semester,
        special_subject: state.settings.special_subject
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay })(DayView);

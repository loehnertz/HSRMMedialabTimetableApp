import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { Card, CardSection } from './common';
import { fetchWeek } from '../actions';
import { SPECIAL_SUBJECTS } from '../actions/defaults';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import EventItem from './EventItemComponent';

class SingleDayView extends Component {
    state = {
        anyEventRendered: false
    };

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

    renderRow(eventJSON, sectionID, rowID, highlightRow) {
        let masterdataJSON = JSON.parse(this.props.masterdata);
        let eventLecturers = [];
        let eventsCount = this.dataSource["_cachedRowCount"];

        console.log((parseInt(rowID) + 1), eventsCount);

        if (eventJSON.noEvents) {
            return (
                <Card style={styles.flex}>
                    <CardSection style={styles.noEventsCardSection}>
                        <Text style={styles.noEventsText}>{i18n.t('no_events')}</Text>
                    </CardSection>
                </Card>
            );
        } else {
            let eventName = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["name"];
            let eventShortname = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["shortname"];
            let eventNote = eventJSON["note"];
            let eventRoom = eventJSON["rooms"][0];
            for (let lecturer in eventJSON["lecturers"]) {
                eventLecturers.push(_.get(masterdataJSON["persons"], eventJSON["lecturers"][lecturer])["name"]);
            }
            eventLecturers = JSON.stringify(eventLecturers);
            let eventSlot = eventJSON["slot"];

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
                this.props.special_subject !== 'all' && !eventShortname.includes(this.props.special_subject.toUpperCase()) ||  // If they chose a 'special_subject' and the 'event' is one of the kind
                this.props.lecture_group !== 'all' && eventNote.includes("Gruppe") && !eventNote.includes(this.props.lecture_group.toUpperCase()) && !eventNote.includes("alle") && !eventNote.includes("Alle")  // If they chose a 'lecture_group' and the 'event' is one of the kind
            ) {
                if (
                    !special_subjectRegEx.test(eventShortname) ||  // If the 'event' is not a 'special_subject'
                    this.props.program + this.props.semester !== this.props.user  // If the user changed their default semester
                ) {
                    this.state.anyEventRendered = true;
                    return <EventItem eventName={eventName} eventRoom={eventRoom} eventLecturers={eventLecturers} eventNote={eventNote} eventSlot={eventSlot} />;
                } else if (this.state.anyEventRendered === false && (parseInt(rowID) + 1) === eventsCount) {
                    return (
                        <Card style={styles.flex}>
                            <CardSection style={styles.noEventsCardSection}>
                                <Text style={styles.noEventsText}>{i18n.t('no_events')}</Text>
                            </CardSection>
                        </Card>
                    );
                } else {
                    return null;
                }
            } else {
                this.state.anyEventRendered = true;
                return <EventItem eventName={eventName} eventRoom={eventRoom} eventLecturers={eventLecturers} eventNote={eventNote} eventSlot={eventSlot} />;
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

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
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
        semester: state.settings.semester,
        special_subject: state.settings.special_subject,
        lecture_group: state.settings.lecture_group
    }
};

export default connect(mapStateToProps, { fetchWeek })(SingleDayView);

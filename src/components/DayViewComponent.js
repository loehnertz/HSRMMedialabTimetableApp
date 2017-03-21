import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    Button,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchWeek, selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import ListItem from './ListItemComponent';

class DayView extends Component {
    componentWillMount() {
        this.createDataSource(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.createDataSource(nextProps);
    }

    _onRefresh() {
        this.props.fetchWeek(this.props.user, this.props.program, this.props.currentWeek);
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
        let eventRoom;
        let eventLecturers = [];
        let eventNote;
        let eventSlot;

        if (eventJSON.noEvents) {
            return <Text style={styles.noEventsText}>{i18n.t('no_events')}</Text>;
        } else {
            eventName = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["shortname"];
            if (this.props.special_subject === 'all' || eventName.includes(this.props.special_subject.toUpperCase())) {
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
            <View style={styles.flex}>
                <View style={styles.header}>
                    <Button
                        onPress={() => {this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek - 1)); this.props.selectDay('Mon');}}
                        title={i18n.t('previous')}
                        color="#E10019"
                        accessibilityLabel={i18n.t('previous') + ' ' + i18n.t('week')}
                    />
                    <Text style={styles.headerText}>{i18n.t('week_of_the_year')} {this.props.currentWeek}</Text>
                    <Button
                        onPress={() => {this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek + 1)); this.props.selectDay('Mon');}}
                        title={i18n.t('next')}
                        color="#E10019"
                        accessibilityLabel={i18n.t('next') + ' ' + i18n.t('week')}
                    />
                </View>
                <View style={[styles.flex, { paddingBottom: 80 }]}>
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
        backgroundColor: "#F6F6F6",
        padding: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    noEventsText: {
        fontSize: 28,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 150
    },
    flex: {
        flex: 1
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay,
        special_subject: state.settings.special_subject
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay })(DayView);

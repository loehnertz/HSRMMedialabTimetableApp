import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform
} from 'react-native';
import { EventModal } from './common';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { SPECIAL_SUBJECTS } from '../actions/defaults';
import _ from 'lodash';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import ListItem from './EventItemComponent';

class WeekView extends Component {
    state = {
        columnWidth: -1,
        showEventModal: false
    };

    componentDidMount() {
        Actions.refresh({key: 'timetable', title: i18n.t('week_view')});
    }

    setEventModal(eventJSON) {
        let masterdataJSON = JSON.parse(this.props.masterdata);
        let eventLecturers = [];

        let eventName = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["shortname"];
        let eventRoom = eventJSON["rooms"][0];
        for (let lecturer in eventJSON["lecturers"]) {
            eventLecturers.push(_.get(masterdataJSON["persons"], eventJSON["lecturers"][lecturer])["name"]);
        }
        eventLecturers = JSON.stringify(eventLecturers);
        let eventNote = eventJSON["note"];
        let eventSlot = eventJSON["slot"];

        let contentEventModal = (
            <ListItem eventName={eventName} eventRoom={eventRoom} eventLecturers={eventLecturers} eventNote={eventNote} eventSlot={eventSlot}/>
        );

        this.setState({ contentEventModal: contentEventModal });

        this.setState({ showEventModal: true });
    }

    closeEventModal() {
        this.setState({ showEventModal: false });
    }

    renderEventModal() {
        return this.state.contentEventModal;
    }

    renderTimeslots() {
        let slots = this.props.slots;
        const realSlots = slots.slice(1);  // Used a constant here to avoid the slicing on every call of the method

        return realSlots.map((slots) =>
            <View key={slots.start} style={styles.slotView}>
                <Text style={styles.slotsText}>{slots.start}</Text>
                <Text style={styles.slotsText}>—</Text>
                <Text style={styles.slotsText}>{slots.end}</Text>
            </View>
        );
    }

    renderDay(day) {
        if (this.state.columnWidth !== -1) {  // Only trigger after the width of a day column was read
            let dayEvents = _.filter(this.props.events, { 'day': day });

            let masterdataJSON = JSON.parse(this.props.masterdata);
            let eventShortname;
            let eventNote;

            let special_subjectProgram = SPECIAL_SUBJECTS[this.props.program];
            let special_subjectRegEx = '';
            for (let special_subject in special_subjectProgram) {
                special_subjectRegEx += `(${special_subjectProgram[special_subject]["shortname"].toUpperCase()})`;
                if ((parseInt(special_subject) + 1) !== special_subjectProgram.length) {  // Check if it's NOT the last iteration
                    special_subjectRegEx += '|'
                }
            }
            special_subjectRegEx = new RegExp(special_subjectRegEx);

            for (let event in dayEvents) {
                eventShortname = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': dayEvents[event]["course"] })["shortname"];
                dayEvents[event].shortname = eventShortname;
                eventNote = dayEvents[event]["note"];

                if (this.props.special_subject !== 'all' && !eventShortname.includes(this.props.special_subject.toUpperCase())) {
                    if (
                        !special_subjectRegEx.test(eventShortname) ||  // If the 'event' is not a 'special_subject'
                        this.props.program + this.props.semester !== this.props.user  // If the user changed their default semester
                    ) {
                        dayEvents[event].toRemove = false;
                    } else {
                        dayEvents[event].toRemove = true;
                    }
                }
            }

            _.remove(dayEvents, 'toRemove');

            return dayEvents.map((event) =>
                <TouchableOpacity
                    key={event.timestamp}
                    onPress={this.setEventModal.bind(this, event)}
                    activeOpacity={0.8}
                    style={[
                        styles.dayView,
                        {
                            top: (((parseInt(event.start) - 1) * 100)),  // How far from the top of the day column should be located
                            height: ((parseInt(event.end) - parseInt(event.start)) * 100),  // Calculate the height of the event if it spans multiple timeslots
                            width: ((this.state.columnWidth / parseInt(event.multiple))),  // Take the calculated total width of a day column and divide it by how many concurrent events there are
                            left: ((parseInt(event.candidate) - 1) * (this.state.columnWidth / parseInt(event.multiple))),  // If there are multiple events in one timeslot move them next to each other based on the 'candidate' value from the API
                            right: ((parseInt(event.candidate) - parseInt(event.multiple)) * (this.state.columnWidth / parseInt(event.multiple)))
                        }
                    ]}
                >
                    <Text>
                        {event.shortname}
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    renderCells() {
        let cells = [];
        let slots = this.props.slots;
        const realSlots = slots.slice(1);  // Used a constant here to avoid the slicing on every call of the method

        for (let i = 0; i < realSlots.length; i++) {
            cells.push(i * 100);
        }

        return cells.map((event) =>
            <View key={event} style={[styles.cellView, { top: event }]}>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.columnContainer}>
                <View style={styles.slotsColumn}>
                    <Text style={styles.columnHeader}>{i18n.t('timeslots')}</Text>
                    {this.renderTimeslots()}
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Mon')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderCells()}
                        {this.renderDay('mon')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Tue')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderCells()}
                        {this.renderDay('tue')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Wed')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderCells()}
                        {this.renderDay('wed')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Thu')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderCells()}
                        {this.renderDay('thu')}
                    </View>
                </View>
                <View
                    style={styles.column}
                    onLayout={(event) => { this.setState({columnWidth: event.nativeEvent.layout.width}); }}  // Saves the width of a day column used for calculating the width of a slot with multiple events
                >
                    <Text style={styles.columnHeader}>{i18n.t('Fri')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderCells()}
                        {this.renderDay('fri')}
                    </View>
                </View>
                <EventModal
                    visible={this.state.showEventModal}
                    onClose={this.closeEventModal.bind(this)}
                >
                    {this.renderEventModal()}
                </EventModal>
            </View>
        );
    }
}

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    columnContainer: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    columnHeader: {
        fontSize: (Platform.OS === 'android') ? 18 : 14,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 18
    },
    column: {
        flex: 1,
        flexDirection: "column",
        marginLeft: 2.5,
        marginRight: 2.5
    },
    slotsColumn: {
        flexDirection: "column",
        marginRight: 15
    },
    slotView: {
        justifyContent: "center",
        alignItems: "center",
        height: 100
    },
    dayView: {
        alignSelf: "center",
        alignItems: "center",
        position: "absolute",
        height: 100,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        elevation: 2.5,
        shadowColor: '#333333',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.60
    },
    cellView: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: "#EEEEEE",
        borderTopWidth: 3,
        borderTopColor: "white"
    },
    eventCell: {
        position: "relative"
    },
    slotsText: {
        fontSize: 15,
        fontWeight: "bold"
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        masterdata: state.timetable.masterdata,
        slots: state.timetable.timeslots,
        semester: state.settings.semester,
        special_subject: state.settings.special_subject
    }
};

export default connect(mapStateToProps, {})(WeekView);

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
import { fetchWeek } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class WeekView extends Component {
    state = {
        columnWidth: -1
    };

    componentDidMount() {
        Actions.refresh({key: 'timetable', title: i18n.t('week_view')});
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

            return dayEvents.map((event) =>
                <View
                    key={event.timestamp}
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
                        {event.editor}
                    </Text>
                </View>
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
            </View>
        );
    }
}

i18n.locale = 'de';
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
        fontSize: 18,
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
        position: "absolute",
        height: 100,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        elevation: 2.5
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
        currentWeek: state.timetable.currentWeek,
        semester: state.settings.semester,
        special_subject: state.settings.special_subject
    }
};

export default connect(mapStateToProps, { fetchWeek })(WeekView);

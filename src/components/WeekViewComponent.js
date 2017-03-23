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
    componentDidMount() {
        Actions.refresh({key: 'timetable', title: i18n.t('week_view')});
    }

    renderTimeslots() {
        let slots = this.props.slots;
        slots.splice(0, 1);

        return slots.map((slots) =>
            <View key={slots.start} style={styles.rowView}>
                <Text key={slots.start} style={styles.slotsText}>
                    {slots.start}{"\n    -\n"}{slots.end}
                </Text>
            </View>
        );
    }

    renderDay(day) {
        let dayEvents = _.filter(this.props.events, { 'day': day });

        return dayEvents.map((event) =>
            <View key={event.timestamp} style={[styles.rowView, { position: "absolute", top: (((parseInt(event.start) - 1) * 100)) }]}>
                <Text key={event.timestamp}>
                    {event.editor}
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.columnContainer}>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('timeslots')}</Text>
                    {this.renderTimeslots()}
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Mon')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderDay('mon')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Tue')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderDay('tue')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Wed')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderDay('wed')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Thu')}</Text>
                    <View style={styles.eventCell}>
                        {this.renderDay('thu')}
                    </View>
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>{i18n.t('Fri')}</Text>
                    <View style={styles.eventCell}>
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
        flexDirection: "row"
    },
    column: {
        flex: 1,
        flexDirection: "column",
        marginLeft: 5,
        marginRight: 5
    },
    columnHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 36
    },
    rowView: {
        height: 100
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

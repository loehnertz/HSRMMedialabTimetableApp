import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    AsyncStorage,
    LayoutAnimation,
    UIManager
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { fetchWeek, selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import DayView from './DayViewComponent';
import DaySwitcher from './DaySwitcherComponent';

class Timetable extends Component {
    componentWillMount() {
        this.props.fetchWeek(this.props.user, this.props.program, '17');  // Using the 17th week of the year to get results from the API

        AsyncStorage.getItem('masterdata')
            .then((item) => JSON.parse(item))
            .then((itemJson) => {
                this.setState({
                    masterdata: JSON.stringify(itemJson)
                });
                this.renderTimeslots(itemJson["timetable"]["timeslots"]);
            });

        let today = moment().format('ddd');
        let hour = moment().format('H');
        if (today === "Sat" || today === "Sun") {  // If it's on a weekend, jump to the next Monday
            this.props.selectDay('Mon');
        } else if (hour >= 19 && today === "Fri") {  // If it's after 19:00 and a Friday, jump to the next Monday
            this.props.selectDay('Mon');
        } else if (hour >= 19 && today !== "Fri") {  // If it's after 19:00, jump to the following day of the week
            today = moment().add(1, 'day').format('ddd');
            this.props.selectDay(today);
        } else {
            this.props.selectDay(today);
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    renderTimetable() {
        if (this.props.loading) {
            return (
                <View style={styles.spinner}>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        } else {
            if (this.props.week && this.state.masterdata && this.state.slots) {
                let events = [];
                let eventsList = JSON.parse(this.props.week)["events"];
                let eventIndex = 0;  // Introduced this variable because the index of 'let event' is forged due to an if-statement inside the loop

                for (let event in eventsList) {
                    if (eventsList[event]["day"] === this.props.selectedDay) {
                        events.push(eventsList[event]);
                        events[eventIndex]["slot"] = `${this.state.slots[eventsList[event]["start"]].start}\n    -\n${this.state.slots[eventsList[event]["end"]].end}`;
                        eventIndex += 1;  // Increase the actual index by one every iteration the if-statement passes
                    }
                }

                let day = moment().day(this.props.selectedDay).week(this.props.currentWeek).format('ddd');
                let date = moment().day(this.props.selectedDay).week(this.props.currentWeek).format('DD.MM.YYYY');

                return (
                    <View style={styles.dayView}>
                        <DayView currentWeek={this.props.currentWeek} week={this.props.week} masterdata={this.state.masterdata} events={events} />
                        <DaySwitcher day={i18n.t(day) + ', ' + date} />
                    </View>
                );
            }
        }
    }

    renderTimeslots(timeslots) {
        let slots = [];
        for (let slot in timeslots) {
            slots.push({
                start: timeslots[slot]["start"],
                end: timeslots[slot]["end"]
            });
            if (timeslots[slot]["text"]) {
                slots.push(timeslots[slot]["text"]);
            }
        }
        slots.splice(0, 1);
        slots.splice(8, 1);
        this.setState({ slots: slots });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderTimetable()}
            </View>
        );
    }
}

i18n.locale = 'de';
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    dayView: {
        flex: 1,
        flexDirection: "column"
    },
    headerDay: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#CCCCCC",
        padding: 10
    },
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        week: state.timetable.fetchedWeek,
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay,
        loading: state.timetable.loadingFetch
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay })(Timetable);

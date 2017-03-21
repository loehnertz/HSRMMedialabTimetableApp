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
import moment from 'moment';
import Orientation from 'react-native-orientation';
import { fetchWeek, selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import DayView from './DayViewComponent';
import DaySwitcher from './DaySwitcherComponent';
import WeekView from './WeekViewComponent';

class Timetable extends Component {
    componentWillMount() {
        setTimeout(() => { this.props.fetchWeek(this.props.user, this.props.program, '17', this.props.semester); }, 1000);  // Using the 17th week of the year to get results from the API
        // TODO: Try to refactor the line above so one does not need the 'setTimeout()'

        let initialOrientation = Orientation.getInitialOrientation();
        if (initialOrientation === 'PORTRAIT') {
            this.setState({ orientation: initialOrientation });
        } else if (initialOrientation === 'LANDSCAPE') {
            this.setState({ orientation: initialOrientation });
        }

        Orientation.addOrientationListener(this._orientationDidChange);

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
        LayoutAnimation.easeInEaseOut();
    }

    _orientationDidChange = (changedOrientation) => {
        if (changedOrientation === 'PORTRAIT') {
            this.setState({ orientation: changedOrientation });
        } else if (changedOrientation === 'LANDSCAPE') {
            this.setState({ orientation: changedOrientation });
        }
    };

    renderTimetable() {
        if (this.props.loading) {
            return (
                <View style={styles.spinner}>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        } else {
            if (this.props.week && this.props.slots) {
                if (this.state.orientation === 'PORTRAIT') {  // Render: DayView
                    let events = [];
                    let eventsList = JSON.parse(this.props.week)["events"];
                    let eventIndex = 0;  // Introduced this variable because the index of 'let event' is forged due to an if-statement inside the loop

                    for (let event in eventsList) {
                        if (eventsList[event]["day"] === this.props.selectedDay) {
                            events.push(eventsList[event]);
                            events[eventIndex]["slot"] = `${this.props.slots[eventsList[event]["start"]].start}\n    -\n${this.props.slots[eventsList[event]["end"]].end}`;
                            eventIndex += 1;  // Increase the actual index by one every iteration the if-statement passes
                        }
                    }

                    let day = moment().day(this.props.selectedDay).week(this.props.currentWeek).format('ddd');
                    let date = moment().day(this.props.selectedDay).week(this.props.currentWeek).format('DD.MM.YYYY');

                    return (
                        <View style={styles.dayView}>
                            <DayView events={events} />
                            <DaySwitcher day={i18n.t(day) + ', ' + date} />
                        </View>
                    );
                } else if (this.state.orientation === 'LANDSCAPE') {  // Render: WeekView
                    return (
                        <View>
                            <WeekView />
                        </View>
                    );
                }
            }
        }
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
        masterdata: state.timetable.masterdata,
        slots: state.timetable.timeslots,
        week: state.timetable.fetchedWeek,
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay,
        loading: state.timetable.loadingFetch,
        semester: state.settings.semester
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay })(Timetable);

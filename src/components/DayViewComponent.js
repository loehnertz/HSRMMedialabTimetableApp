import React, { Component } from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { selectDay } from '../actions';
import DaySwitcher from './DaySwitcherComponent';
import SingleDayView from './SingleDayViewComponent';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class DayView extends Component {
    state = {
        swiperHeight: -1
    };

    _onMomentumScrollEnd(e, state, context) {
        switch (state.index) {
            case 0:
                this.props.selectDay('Mon');
                break;
            case 1:
                this.props.selectDay('Tue');
                break;
            case 2:
                this.props.selectDay('Wed');
                break;
            case 3:
                this.props.selectDay('Thu');
                break;
            case 4:
                this.props.selectDay('Fri');
                break;
        }
    }

    renderDayView() {
        let today = moment().format('ddd');
        let eventsList = this.props.events;
        let eventsMon = [];
        let eventIndexMon = 0;
        let eventsTue = [];
        let eventIndexTue = 0;
        let eventsWed = [];
        let eventIndexWed = 0;
        let eventsThu = [];
        let eventIndexThu = 0;
        let eventsFri = [];
        let eventIndexFri = 0;

        for (let event in eventsList) {
            if (this.props.hidePastEvents && today !== 'Sat' && today !== 'Sun') {
                let currentTime = parseInt(moment().format('HMM'));
                let eventEndTime = parseInt(this.props.slots[eventsList[event]["start"]]["end"].replace(/:/, ''));

                switch (today) {
                    case 'Mon':
                        switch (eventsList[event]["day"]) {
                            case 'mon':
                                if (currentTime < eventEndTime) {
                                    eventsMon.push(eventsList[event]);
                                    eventsMon[eventIndexMon]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                    eventIndexMon += 1;  // Increase the actual index by one every iteration the if-statement passes
                                }
                                break;
                            case 'tue':
                                eventsTue.push(eventsList[event]);
                                eventsTue[eventIndexTue]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexTue += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'wed':
                                eventsWed.push(eventsList[event]);
                                eventsWed[eventIndexWed]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexWed += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'thu':
                                eventsThu.push(eventsList[event]);
                                eventsThu[eventIndexThu]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexThu += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'fri':
                                eventsFri.push(eventsList[event]);
                                eventsFri[eventIndexFri]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexFri += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                        }
                        break;
                    case 'Tue':
                        switch (eventsList[event]["day"]) {
                            case 'mon':
                                eventsMon.push(eventsList[event]);
                                eventsMon[eventIndexMon]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexMon += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'tue':
                                if (currentTime < eventEndTime) {
                                    eventsTue.push(eventsList[event]);
                                    eventsTue[eventIndexTue]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                    eventIndexTue += 1;  // Increase the actual index by one every iteration the if-statement passes
                                }
                                break;
                            case 'wed':
                                eventsWed.push(eventsList[event]);
                                eventsWed[eventIndexWed]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexWed += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'thu':
                                eventsThu.push(eventsList[event]);
                                eventsThu[eventIndexThu]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexThu += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'fri':
                                eventsFri.push(eventsList[event]);
                                eventsFri[eventIndexFri]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexFri += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                        }
                        break;
                    case 'Wed':
                        switch (eventsList[event]["day"]) {
                            case 'mon':
                                eventsMon.push(eventsList[event]);
                                eventsMon[eventIndexMon]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexMon += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'tue':
                                eventsTue.push(eventsList[event]);
                                eventsTue[eventIndexTue]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexTue += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'wed':
                                if (currentTime < eventEndTime) {
                                    eventsWed.push(eventsList[event]);
                                    eventsWed[eventIndexWed]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                    eventIndexWed += 1;  // Increase the actual index by one every iteration the if-statement passes
                                }
                                break;
                            case 'thu':
                                eventsThu.push(eventsList[event]);
                                eventsThu[eventIndexThu]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexThu += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'fri':
                                eventsFri.push(eventsList[event]);
                                eventsFri[eventIndexFri]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexFri += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                        }
                        break;
                    case 'Thu':
                        switch (eventsList[event]["day"]) {
                            case 'mon':
                                eventsMon.push(eventsList[event]);
                                eventsMon[eventIndexMon]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexMon += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'tue':
                                eventsTue.push(eventsList[event]);
                                eventsTue[eventIndexTue]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexTue += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'wed':
                                eventsWed.push(eventsList[event]);
                                eventsWed[eventIndexWed]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexWed += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'thu':
                                if (currentTime < eventEndTime) {
                                    eventsThu.push(eventsList[event]);
                                    eventsThu[eventIndexThu]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                    eventIndexThu += 1;  // Increase the actual index by one every iteration the if-statement passes
                                }
                                break;
                            case 'fri':
                                eventsFri.push(eventsList[event]);
                                eventsFri[eventIndexFri]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexFri += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                        }
                        break;
                    case 'Fri':
                        switch (eventsList[event]["day"]) {
                            case 'mon':
                                eventsMon.push(eventsList[event]);
                                eventsMon[eventIndexMon]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexMon += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'tue':
                                eventsTue.push(eventsList[event]);
                                eventsTue[eventIndexTue]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexTue += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'wed':
                                eventsWed.push(eventsList[event]);
                                eventsWed[eventIndexWed]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexWed += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'thu':
                                eventsThu.push(eventsList[event]);
                                eventsThu[eventIndexThu]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                eventIndexThu += 1;  // Increase the actual index by one every iteration the if-statement passes
                                break;
                            case 'fri':
                                if (currentTime < eventEndTime) {
                                    eventsFri.push(eventsList[event]);
                                    eventsFri[eventIndexFri]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                                    eventIndexFri += 1;  // Increase the actual index by one every iteration the if-statement passes
                                }
                                break;
                        }
                        break;
                }  // TODO: Make this 'switch-case' DRYer
            } else {
                switch (eventsList[event]["day"]) {
                    case 'mon':
                        eventsMon.push(eventsList[event]);
                        eventsMon[eventIndexMon]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                        eventIndexMon += 1;  // Increase the actual index by one every iteration the if-statement passes
                        break;
                    case 'tue':
                        eventsTue.push(eventsList[event]);
                        eventsTue[eventIndexTue]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                        eventIndexTue += 1;  // Increase the actual index by one every iteration the if-statement passes
                        break;
                    case 'wed':
                        eventsWed.push(eventsList[event]);
                        eventsWed[eventIndexWed]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                        eventIndexWed += 1;  // Increase the actual index by one every iteration the if-statement passes
                        break;
                    case 'thu':
                        eventsThu.push(eventsList[event]);
                        eventsThu[eventIndexThu]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                        eventIndexThu += 1;  // Increase the actual index by one every iteration the if-statement passes
                        break;
                    case 'fri':
                        eventsFri.push(eventsList[event]);
                        eventsFri[eventIndexFri]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                        eventIndexFri += 1;  // Increase the actual index by one every iteration the if-statement passes
                        break;
                }
            }
        }

        let swiperIndex = -1;

        switch (this.props.selectedDay) {
            case 'mon':
                swiperIndex = 0;
                break;
            case 'tue':
                swiperIndex = 1;
                break;
            case 'wed':
                swiperIndex = 2;
                break;
            case 'thu':
                swiperIndex = 3;
                break;
            case 'fri':
                swiperIndex = 4;
                break;
        }

        let day = moment().day(this.props.selectedDay).week(this.props.currentWeek).format('ddd');
        let date = moment().day(this.props.selectedDay).week(this.props.currentWeek).format('DD.MM.YYYY');

        return (
            <View
                onLayout={(event) => {this.setState({ swiperHeight: event.nativeEvent.layout.height })}}  // Set the height of the 'View' for the 'Swiper'
                style={styles.dayView}
            >
                <ScrollView>
                    <Swiper
                        loop={false}
                        showsPagination={false}
                        index={swiperIndex}
                        height={this.state.swiperHeight}
                        onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
                    >
                        <SingleDayView events={eventsMon} />
                        <SingleDayView events={eventsTue} />
                        <SingleDayView events={eventsWed} />
                        <SingleDayView events={eventsThu} />
                        <SingleDayView events={eventsFri} />
                    </Swiper>
                </ScrollView>
                <DaySwitcher day={i18n.t(day) + ', ' + date} />
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderDayView()}
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
    }
};

const mapStateToProps = state => {
    return {
        slots: state.timetable.timeslots,
        selectedDay: state.timetable.selectedDay,
        currentWeek: state.timetable.currentWeek,
        hidePastEvents: state.settings.hidePastEvents
    }
};

export default connect(mapStateToProps, { selectDay })(DayView);

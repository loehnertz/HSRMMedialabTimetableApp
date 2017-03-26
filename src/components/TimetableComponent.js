import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    ActivityIndicator,
    AsyncStorage,
    Animated,
    LayoutAnimation,
    UIManager,
    AppState
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Orientation from 'react-native-orientation';
import Swiper from 'react-native-swiper'
import { IconButton } from './common';
import { fetchWeek, selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import DayView from './DayViewComponent';
import DaySwitcher from './DaySwitcherComponent';
import WeekView from './WeekViewComponent';

class Timetable extends Component {
    state = {
        headerHeight: new Animated.Value(60),
        iconButtonSize: new Animated.Value(20),
        iconButtonPadding: new Animated.Value(10)
    };

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

        AppState.addEventListener('change', this._handleAppStateChange.bind(this));

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
        // Had to disable the animation in virtue of it causing the 'DayView' to freeze during the rendering
        // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        // LayoutAnimation.easeInEaseOut();
    }

    componentDidUpdate() {
        if (this.state.oldScrollOffsetY > 90) {
            Animated.spring(
                this.state.headerHeight,
                {
                    toValue: 35,
                    friction: 10,
                    tension: 100
                }
            ).start();
            Animated.spring(
                this.state.iconButtonSize,
                {
                    toValue: 10,
                    friction: 10,
                    tension: 100
                }
            ).start();
            Animated.spring(
                this.state.iconButtonPadding,
                {
                    toValue: 5,
                    friction: 10,
                    tension: 100
                }
            ).start();
        } else if (this.state.oldScrollOffsetY < 60) {
            Animated.spring(
                this.state.headerHeight,
                {
                    toValue: 60,
                    friction: 10,
                    tension: 100
                }
            ).start();
            Animated.spring(
                this.state.iconButtonSize,
                {
                    toValue: 20,
                    friction: 10,
                    tension: 100
                }
            ).start();
            Animated.spring(
                this.state.iconButtonPadding,
                {
                    toValue: 10,
                    friction: 10,
                    tension: 100
                }
            ).start();
        }
    }

    _orientationDidChange = (changedOrientation) => {
        if (changedOrientation === 'PORTRAIT') {
            this.setState({ orientation: changedOrientation });
        } else if (changedOrientation === 'LANDSCAPE') {
            this.setState({ orientation: changedOrientation });
        }
    };

    _handleAppStateChange = (appState) => {
        if (appState === "background") {
            let newOrientation = Orientation.getInitialOrientation();
            if (newOrientation === 'PORTRAIT') {
                this.setState({ orientation: newOrientation });
            } else if (newOrientation === 'LANDSCAPE') {
                this.setState({ orientation: newOrientation });
            }
        }
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

    handleScrollDirection(scroll) {
        let currentOffsetY = scroll.nativeEvent.contentOffset.y;
        let scrollDirectionDown = currentOffsetY > this.state.oldScrollOffsetY;
        this.setState({ oldScrollOffsetY: currentOffsetY, scrollDirectionDown: scrollDirectionDown });
    }

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
                    let eventsList = JSON.parse(this.props.week)["events"];
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
                            onLayout={(event) => { this.setState({swiperHeight: event.nativeEvent.layout.height}); }}  // Set the height of the 'View' for the 'Swiper'
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
                                    <DayView events={eventsMon} />
                                    <DayView events={eventsTue} />
                                    <DayView events={eventsWed} />
                                    <DayView events={eventsThu} />
                                    <DayView events={eventsFri} />
                                </Swiper>
                            </ScrollView>
                            <DaySwitcher day={i18n.t(day) + ', ' + date} />
                        </View>
                    );
                } else if (this.state.orientation === 'LANDSCAPE') {  // Render: WeekView
                    let eventsWeek = JSON.parse(this.props.week)["events"];

                    return (
                        <ScrollView onScroll={this.handleScrollDirection.bind(this)} style={styles.weekView}>
                            <WeekView events={eventsWeek} />
                        </ScrollView>
                    );
                }
            }
        }
    }

    renderHeader() {
        return (
            <Animated.View style={[styles.header, { height: this.state.headerHeight["_value"] }]}>
                <IconButton
                    onPress={() => {this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek - 1), this.props.semester); this.props.selectDay('Mon');}}
                    style={{ paddingTop: this.state.iconButtonPadding["_value"], paddingBottom: this.state.iconButtonPadding["_value"] }}
                >
                    <Image
                        source={require('../assets/images/backwards.png')}
                        style={{ height: this.state.iconButtonSize["_value"], width: this.state.iconButtonSize["_value"] }}
                    />
                </IconButton>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>
                        {i18n.t('week_of_the_year')} {this.props.currentWeek}
                    </Text>
                    <Text>
                        {this.findAnnotation()}
                    </Text>
                </View>
                <IconButton
                    onPress={() => {this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek + 1), this.props.semester); this.props.selectDay('Mon');}}
                    style={{ paddingTop: this.state.iconButtonPadding["_value"], paddingBottom: this.state.iconButtonPadding["_value"] }}
                >
                    <Image
                        source={require('../assets/images/forward.png')}
                        style={{ height: this.state.iconButtonSize["_value"], width: this.state.iconButtonSize["_value"] }}
                    />
                </IconButton>
            </Animated.View>
        );
    }

    findAnnotation() {
        let weeks = JSON.parse(this.props.masterdata)["timetable"]["weeks"]["kw" + this.props.currentWeek];
        if (weeks !== undefined) {
            return weeks["annotation"];
        }
    }

    render() {
        console.log(this.state.iconButtonSize, this.state.headerHeight);

        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
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
    weekView: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        elevation: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
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

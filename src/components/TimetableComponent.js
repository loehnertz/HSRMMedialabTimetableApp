import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Animated,
    AppState,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Orientation from 'react-native-orientation';
import OneSignal from 'react-native-onesignal';
import { fetchWeek, selectDay, selectWeek, setOrientation, startLoading, stopLoading } from '../actions';
import moment from 'moment';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import DayView from './DayViewComponent';
import WeekView from './WeekViewComponent';
import { IconButton } from './common';
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);

class Timetable extends Component {
    state = {
        headerHeight: new Animated.Value(60),
        annotationHeight: new Animated.Value(20),
        iconButtonSize: new Animated.Value(20),
        iconButtonPadding: new Animated.Value(10),
        doneInitialScrollWeekView: false
    };

    componentWillMount() {
        let tryToFetchWeek = setInterval(() => {
            if (this.props.user && this.props.program && this.props.currentWeek && this.props.semester) {
                this.props.fetchWeek(this.props.user, this.props.program, this.props.currentWeek, this.props.semester);
                clearInterval(tryToFetchWeek);
            }
        }, 123);

        let week = parseInt(moment().format('W'));
        let today = moment().format('ddd');
        let hour = moment().format('H');

        if (today === "Sat" || today === "Sun") {  // If it's on a weekend, jump to the next Monday
            this.props.selectDay('Mon');
            this.props.selectWeek(week + 1);
        } else if (hour >= 19 && today === "Fri") {  // If it's after 19:00 and a Friday, jump to the next Monday
            this.props.selectDay('Mon');
            this.props.selectWeek(week + 1);
        } else if (hour >= 19 && today !== "Fri") {  // If it's after 19:00, jump to the following day of the week
            this.props.selectDay(moment().add(1, 'day').format('ddd'));
            this.props.selectWeek(week);
        } else {
            this.props.selectDay(today);
            this.props.selectWeek(week);
        }

        this.props.setOrientation(Orientation.getInitialOrientation());
    }

    componentDidMount() {
        // The orientation on iOS causes several bugs. Therefore, I decided to not ship the (landscape) 'WeekView' before the major bugs are fixed
        if (Platform.OS === 'ios') {
            Orientation.lockToPortrait();
            this.props.setOrientation('PORTRAIT');
        }

        if (Platform.OS !== 'ios') {
            Orientation.addOrientationListener(this._orientationDidChange);  // Add a listener for the change of the device orientation
            AppState.addEventListener('change', this._handleAppStateChange.bind(this));  // Add a listener for the 'appState' ('active' or 'background')
        }

        if (this.props.activatePushNotifications) {
            OneSignal.setSubscription(true);
        } else {
            OneSignal.setSubscription(false);
        }
        OneSignal.addEventListener('opened', this._onPushNotificationOpened.bind(this));
    }

    componentWillUnmount() {
        Orientation.removeOrientationListener(this._orientationDidChange);  // Remove the listener from 'componentDidMount()'
        // So far 'react-native-router-flux' does not trigger 'componentWillUnmount()' when changing the scene
        // Therefore, at the moment this will never be triggered.
        // I will leave it in though for a possible future use.
    }

    componentWillUpdate() {
        // Had to disable the animation in virtue of it causing the 'DayView' to freeze during the rendering
        // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        // LayoutAnimation.easeInEaseOut();
    }

    componentDidUpdate() {
        if (this.props.orientation === 'LANDSCAPE') {
            if (this.state.scrollOffsetY > 90) {
                this.shrinkHeader(true);
            } else if (this.state.scrollOffsetY < 60) {
                this.shrinkHeader(false);
                if (this.state.emptyAnnotation) {
                    this.hideAnnotation(true);
                } else {
                    this.hideAnnotation(false);
                }
            }
        } else if (this.props.orientation === 'PORTRAIT') {
            this.shrinkHeader(false);

            if (this.state.emptyAnnotation) {
                this.hideAnnotation(true);
            } else {
                this.hideAnnotation(false);
            }
        }
    }

    _onPushNotificationOpened(e) {
        let targetWeek = parseInt(e["notification"]["payload"]["additionalData"]["week"]);
        this.props.fetchWeek(this.props.user, this.props.program, targetWeek, this.props.semester);
        let targetDay = e["notification"]["payload"]["additionalData"]["day"];
        this.props.selectDay(targetDay);
    }

    _onRefresh() {
        this.props.fetchWeek(this.props.user, this.props.program, this.props.currentWeek, this.props.semester);
    }

    _orientationDidChange = (changedOrientation) => {
        Actions.pop();

        if (this.props.orientation !== changedOrientation && changedOrientation !== 'UNKNOWN') {
            this.props.startLoading();
        }

        this.props.setOrientation(changedOrientation);

        setTimeout(() => {  // TODO: Make this more responsive
            this.props.stopLoading();
        }, 1234);
    };

    _handleAppStateChange = (appState) => {
        if (appState === "active") {
            Orientation.getOrientation((error, newOrientation) => {
                this.props.setOrientation(newOrientation);
            });
        }
    };

    handleScrollToWeekViewTimeslot() {
        let currentTime = parseInt(moment().format('HMM'));

        if (this.props.scrollToTimeslot && this.state.doneInitialScrollWeekView === false && currentTime >= 815 && currentTime <= 1915) {
            let scrollOffsetY;

            if (currentTime > 815 && currentTime < 900) {
                scrollOffsetY = 50;
            } else if (currentTime > 900 && currentTime < 945) {
                scrollOffsetY = 150;
            } else if (currentTime > 945 && currentTime < 1045) {
                scrollOffsetY = 250;
            } else if (currentTime > 1045 && currentTime < 1130) {
                scrollOffsetY = 350;
            } else if (currentTime > 1130 && currentTime < 1230) {
                scrollOffsetY = 450;
            } else if (currentTime > 1230 && currentTime < 1315) {
                scrollOffsetY = 550;
            } else if (currentTime > 1315 && currentTime < 1415) {
                scrollOffsetY = 650;
            } else if (currentTime > 1415 && currentTime < 1500) {
                scrollOffsetY = 750;
            } else if (currentTime > 1500 && currentTime < 1545) {
                scrollOffsetY = 850;
            } else if (currentTime > 1545 && currentTime < 1645) {
                scrollOffsetY = 950;
            } else if (currentTime > 1645 && currentTime < 1730) {
                scrollOffsetY = 1050;
            } else if (currentTime > 1730 && currentTime < 1830) {
                scrollOffsetY = 1150;
            } else if (currentTime > 1830 && currentTime < 1915) {
                scrollOffsetY = 1250;
            }

            this.setState({ scrollOffsetY: scrollOffsetY });

            setTimeout(() => {
                this.scrollWeekView.scrollTo({ y: scrollOffsetY });
            }, 500);
            // Using 500 milliseconds delay here because otherwise it looks really confusing to the user why the whole 'View' just jumped downwards
        }

        this.setState({ doneInitialScrollWeekView: true });
    }

    shrinkHeader(shrink) {
        if (shrink) {
            Animated.spring(
                this.state.headerHeight,
                {
                    toValue: 35,
                    friction: 10,
                    tension: 100
                }
            ).start();
            Animated.timing(
                this.state.annotationHeight,
                {
                    toValue: 0,
                    duration: 0
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
        } else {
            Animated.spring(
                this.state.headerHeight,
                {
                    toValue: 60,
                    friction: 10,
                    tension: 100
                }
            ).start();
            Animated.spring(
                this.state.annotationHeight,
                {
                    toValue: 20,
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

    hideAnnotation(hide) {
        if (hide) {
            Animated.timing(
                this.state.annotationHeight,
                {
                    toValue: 0,
                    duration: 0
                }
            ).start();
        } else {
            Animated.spring(
                this.state.annotationHeight,
                {
                    toValue: 20,
                    friction: 10,
                    tension: 100
                }
            ).start();
        }
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
                let eventsList = JSON.parse(this.props.week)["events"];
                let events = [];

                for (let event in eventsList) {
                    events.push(eventsList[event]);
                    events[event]["slot"] = `${this.props.slots[eventsList[event]["start"]].start} - ${this.props.slots[eventsList[event]["end"]].end}`;
                }

                if (this.props.orientation === 'PORTRAIT') {  // Render: DayView
                    return (
                        <DayView events={events} />
                    );
                } else if (this.props.orientation === 'LANDSCAPE') {  // Render: WeekView
                    return (
                        <ScrollView
                            onLayout={this.handleScrollToWeekViewTimeslot.bind(this)}
                            onScroll={(scroll) => this.setState({ scrollOffsetY: scroll.nativeEvent.contentOffset.y })}
                            ref={(scrollView) => this.scrollWeekView = scrollView}
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    onRefresh={this._onRefresh.bind(this)}
                                    colors={['#E10019']}
                                    tintColor="#E10019"
                                />
                            }
                            style={{ flex: 1 }}
                        >
                            <WeekView events={events} />
                        </ScrollView>
                    );
                }
            }
        }
    }

    renderHeader() {
        return (
            <Animated.View style={[styles.header, { height: this.state.headerHeight }]}>
                <AnimatedIconButton
                    onPress={() => {
                        this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek - 1), this.props.semester);
                        this.props.selectDay('Mon');
                        this.setState({ scrollOffsetY: 0 });
                    }}
                    style={{ paddingTop: this.state.iconButtonPadding, paddingBottom: this.state.iconButtonPadding }}
                >
                    <Animated.Image
                        source={require('../assets/images/backwards.png')}
                        style={{ height: this.state.iconButtonSize, width: this.state.iconButtonSize }}
                    />
                </AnimatedIconButton>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>
                        {i18n.t('week_of_the_year')} {this.props.currentWeek}
                    </Text>
                    <Animated.Text style={{ height: this.state.annotationHeight }}>
                        {this.findAnnotation()}
                    </Animated.Text>
                </View>
                <AnimatedIconButton
                    onPress={() => {
                        this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek + 1), this.props.semester);
                        this.props.selectDay('Mon');
                        this.setState({ scrollOffsetY: 0 });
                    }}
                    style={{ paddingTop: this.state.iconButtonPadding, paddingBottom: this.state.iconButtonPadding }}
                >
                    <Animated.Image
                        source={require('../assets/images/forward.png')}
                        style={{ height: this.state.iconButtonSize, width: this.state.iconButtonSize }}
                    />
                </AnimatedIconButton>
            </Animated.View>
        );
    }

    findAnnotation() {
        let weeks = JSON.parse(this.props.masterdata)["timetable"]["weeks"]["kw" + this.props.currentWeek];
        if (weeks !== undefined) {
            if (weeks["annotation"].length > 0) {
                if (this.state.emptyAnnotation === undefined || this.state.emptyAnnotation === true) {
                    setTimeout(() => {
                        this.setState({ emptyAnnotation: false });
                    }, 500);  // Using 500 milliseconds delay here to avoid running into an error with two concurrent setState() a time
                }
                return weeks["annotation"];
            } else {
                if (this.state.emptyAnnotation === undefined || this.state.emptyAnnotation === false) {
                    setTimeout(() => {
                        this.setState({ emptyAnnotation: true });
                    }, 500);  // Using 500 milliseconds delay here to avoid running into an error with two concurrent setState() a time
                }
                return null;
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                {this.renderTimetable()}
            </View>
        );
    }
}

if (Platform.OS === 'android') {
    i18n.defaultLocale = "de";
}
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        elevation: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
        padding: 10,
        marginTop: (Platform.OS === 'ios') ? 10 : 0
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
        orientation: state.timetable.orientation,
        slots: state.timetable.timeslots,
        week: state.timetable.fetchedWeek,
        currentWeek: state.timetable.currentWeek,
        loading: state.timetable.loadingFetch,
        semester: state.settings.semester,
        scrollToTimeslot: state.settings.scrollToTimeslot,
        activatePushNotifications: state.settings.activatePushNotifications
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay, selectWeek, setOrientation, startLoading, stopLoading })(Timetable);

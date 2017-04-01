import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    RefreshControl,
    ActivityIndicator,
    AsyncStorage,
    Animated,
    LayoutAnimation,
    UIManager,
    AppState
} from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { IconButton } from './common';
import { fetchWeek, selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';
import DayView from './DayViewComponent';
import WeekView from './WeekViewComponent';

class Timetable extends Component {
    state = {
        headerHeight: new Animated.Value(60),
        iconButtonSize: new Animated.Value(20),
        iconButtonPadding: new Animated.Value(10)
    };

    componentWillMount() {
        setTimeout(() => {
            this.props.fetchWeek(this.props.user, this.props.program, '17', this.props.semester);
        }, 1000);
        // Using the 17th week of the year to get results from the API
        // TODO: Try to refactor the line above so one does not need the 'setTimeout()'

        let initialOrientation = Orientation.getInitialOrientation();
        if (initialOrientation === 'PORTRAIT') {
            this.setState({ orientation: initialOrientation });
        } else if (initialOrientation === 'LANDSCAPE') {
            this.setState({ orientation: initialOrientation });
        }

        Orientation.addOrientationListener(this._orientationDidChange);

        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    componentWillUpdate() {
        // Had to disable the animation in virtue of it causing the 'DayView' to freeze during the rendering
        // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        // LayoutAnimation.easeInEaseOut();
    }

    componentDidUpdate() {
        if (this.state.orientation === 'LANDSCAPE') {
            if (this.state.scrollOffsetY > 90) {
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
            } else if (this.state.scrollOffsetY < 60) {
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
                
                if (this.state.orientation === 'PORTRAIT') {  // Render: DayView
                    return <DayView events={events} />
                } else if (this.state.orientation === 'LANDSCAPE') {  // Render: WeekView
                    return <WeekView events={events} />;
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
        loading: state.timetable.loadingFetch,
        semester: state.settings.semester
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay })(Timetable);

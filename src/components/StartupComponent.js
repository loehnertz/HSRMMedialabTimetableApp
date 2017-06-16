// Imports
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as Keychain from 'react-native-keychain';
import OneSignal from 'react-native-onesignal';
import { dispatchMasterdata, dispatchSettings, dispatchTimeslots, isUserLoggedIn } from '../actions';

class Startup extends Component {
    state = {
        masterdataAndSettingsDispatched: false,
        timeslotsDispatched: false
    };

    componentWillMount() {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            if (!value || this.props.masterdata === 'null') {
                Keychain.resetGenericPassword().then(() => {
                    AsyncStorage.removeItem('masterdata');
                    AsyncStorage.removeItem('settings');
                    Actions.auth({ type: 'reset' });
                });
                AsyncStorage.setItem('alreadyLaunched', JSON.stringify(true));
            }
        });
        this.props.isUserLoggedIn();
    }

    componentDidMount() {  // Using a 'setInterval()' so the 'LoginForm' component can use this as well
        const dispatchInterval = setInterval(() => {
            if (this.props.user && this.state.masterdataAndSettingsDispatched === false) {
                this.props.dispatchMasterdata();
                this.props.dispatchSettings(this.props.user);
                this.setState({masterdataAndSettingsDispatched: true});
            }

            if (this.props.masterdata && this.state.timeslotsDispatched === false) {
                this.renderTimeslots(JSON.parse(this.props.masterdata)["timetable"]["timeslots"]);
                this.setState({timeslotsDispatched: true});
            }

            if (this.props.user && this.props.masterdata && this.props.timeslots) {
                Actions.main({ type: 'reset' });
                clearInterval(dispatchInterval);
            }
        }, 123);

        OneSignal.configure({});
        OneSignal.enableVibrate(true);
        if (this.props.activatePushNotifications) {
            OneSignal.setSubscription(true);
        } else {
            OneSignal.setSubscription(false);
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
        this.props.dispatchTimeslots(slots);
    }

    render() {
        return (
            <View style={styles.spinner}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }
}

const styles = {
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        masterdata: state.timetable.masterdata,
        timeslots: state.timetable.timeslots,
        activatePushNotifications: state.settings.activatePushNotifications
    }
};

export default connect(mapStateToProps, { dispatchMasterdata, dispatchSettings, dispatchTimeslots, isUserLoggedIn })(Startup);

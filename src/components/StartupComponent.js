// Imports
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import BackgroundJob from 'react-native-background-job';
import { dispatchMasterdata, dispatchSettings, dispatchTimeslots, isUserLoggedIn, checkForTimetableChanges } from '../actions';

class Startup extends Component {
    state = {
        masterdataAndSettingsDispatched: false,
        timeslotsDispatched: false
    };

    componentWillMount() {
        this.props.isUserLoggedIn();

        BackgroundJob.register({
            jobKey: 'refresh_timetable',
            job: () => {
                this.props.checkForTimetableChanges();
            }
        });
    }
    
    componentDidMount() {  // Using a 'setInterval()' so the 'LoginForm' component can use this as well
        const dispatchInterval = setInterval(() => {
            if (this.props.user && this.state.masterdataAndSettingsDispatched === false) {
                this.props.dispatchMasterdata();
                this.props.dispatchSettings(this.props.user);
                this.setState({ masterdataAndSettingsDispatched: true });
            }

            if (this.props.masterdata !== undefined && this.state.timeslotsDispatched === false) {
                this.renderTimeslots(JSON.parse(this.props.masterdata)["timetable"]["timeslots"]);
                this.setState({ timeslotsDispatched: true });
            }

            if (this.props.user && this.props.masterdata && this.props.timeslots) {
                Actions.main({ type: 'reset' });
                clearInterval(dispatchInterval);
            }
        }, 123);

        BackgroundJob.schedule({
            jobKey: 'refresh_timetable',
            period: 15000,  // Just for development
            timeout: 10000
        });
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
        timeslots: state.timetable.timeslots
    }
};

export default connect(mapStateToProps, {
    dispatchMasterdata,
    dispatchSettings,
    dispatchTimeslots,
    isUserLoggedIn,
    checkForTimetableChanges
})(Startup);

// Imports
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { dispatchMasterdata, dispatchSettings, dispatchTimeslots, isUserLoggedIn } from '../actions';

class Startup extends Component {
    state = {
        masterdataAndSettingsDispatched: false,
        timeslotsDispatched: false
    };

    componentWillMount() {
        this.props.isUserLoggedIn();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && this.state.masterdataAndSettingsDispatched === false) {
            nextProps.dispatchMasterdata();
            nextProps.dispatchSettings(nextProps.user);
            this.setState({masterdataAndSettingsDispatched: true});
        }

        if (nextProps.masterdata !== undefined && this.state.timeslotsDispatched === false) {
            this.renderTimeslots(JSON.parse(nextProps.masterdata)["timetable"]["timeslots"]);
            this.setState({timeslotsDispatched: true});
        }

        if (nextProps.user && nextProps.masterdata && nextProps.timeslots) {
            Actions.main({ type: 'reset' });
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
        timeslots: state.timetable.timeslots
    }
};

export default connect(mapStateToProps, { dispatchMasterdata, dispatchSettings, dispatchTimeslots, isUserLoggedIn })(Startup);

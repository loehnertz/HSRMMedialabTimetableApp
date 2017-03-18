import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
//import moment from 'moment';
import { fetchWeek } from '../actions';
import DayView from './DayViewComponent';
import DaySwitcher from './DaySwitcherComponent';

class Timetable extends Component {
    componentWillMount(){
        this.props.fetchWeek(this.props.user, this.props.program, '16');  // Using the 16th week of the year to get results from the API
        AsyncStorage.getItem('masterdata')
            .then((item) => JSON.parse(item))
            .then((itemJson) => {
                this.setState({
                    masterdata: JSON.stringify(itemJson)
                });
            });
    }

    renderTimetable(){
        if (this.props.loading) {
            return (
                <View style={styles.spinner}>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        } else {
            if (this.props.week && this.state.masterdata) {
                let events = [];
                let eventsList = JSON.parse(this.props.week)["events"];

                for (let event in eventsList) {
                    if (eventsList[event]["day"] === "tue") {  // Just for now to test the condition
                        events.push(JSON.stringify(eventsList[event]));
                    }
                }

                return (
                    <View style={styles.dayView}>
                        <DayView day="Dienstag" week={this.props.week} masterdata={this.state.masterdata} events={events} />
                        <DaySwitcher day={JSON.parse(this.props.week)["today"]} />
                    </View>
                );
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
        selectedDay: state.timetable.selectedDay,
        loading: state.timetable.loadingFetch
    }
};

export default connect(mapStateToProps, { fetchWeek })(Timetable);

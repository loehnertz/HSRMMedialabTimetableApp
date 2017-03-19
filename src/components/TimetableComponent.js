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
import { fetchWeek, dispatchSettings } from '../actions';
import DayView from './DayViewComponent';

class Timetable extends Component {
    componentWillMount(){
        this.props.fetchWeek(this.props.user, '16');  // Using the 16th week of the year to get results from the API

        AsyncStorage.getItem('masterdata')
            .then((item) => JSON.parse(item))
            .then((itemJson) => {
                this.setState({
                    masterdata: JSON.stringify(itemJson)
                });
            });

        AsyncStorage.getItem('settings')
            .then((settings) => JSON.parse(settings))
            .then((settingsJson) => {
                console.log(settingsJson);
                this.props.dispatchSettings(settingsJson);
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
                return (
                    <DayView week={this.props.week} masterdata={this.state.masterdata} />  // For now I built the 'DayView' first
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
        week: state.timetable.fetchedWeek,
        loading: state.timetable.loadingFetch
    }
};

export default connect(mapStateToProps, { fetchWeek, dispatchSettings })(Timetable);

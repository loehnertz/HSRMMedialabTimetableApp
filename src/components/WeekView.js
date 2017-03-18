import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
//import moment from 'moment';
import { Spinner } from './common';
import { fetchWeek } from '../actions';

class WeekView extends Component {
    componentWillMount(){
        this.props.fetchWeek(this.props.user, '16');  // Using the 16th week of the year to get results from the API
    }

    renderTimetable(){
        if (this.props.loading) {
            return (
                <View style={styles.spinner}>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        } else {
            if (this.props.week) {
                console.log(JSON.parse(this.props.week));

                return (
                    <View style={styles.headerDay}>
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

export default connect(mapStateToProps, { fetchWeek })(WeekView);

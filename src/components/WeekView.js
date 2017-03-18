import React, { Component } from 'react';
import {
    Text,
    View
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
                <Spinner size="small" />
            );
        } else {
            return (
                <Text>
                    {this.props.week}
                </Text>
            );
        }
    }

    render() {
        return (
            <View style={{ paddingTop: 10 }}>
                {this.renderTimetable()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user,
        week: state.timetable.fetchedWeek,
        loading: state.timetable.loadingFetch
    }
};

export default connect(mapStateToProps, { fetchWeek })(WeekView);

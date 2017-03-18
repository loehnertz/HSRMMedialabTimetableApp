import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchWeek } from '../actions';

class WeekView extends Component {
    componentWillMount(){
        this.props.fetchWeek(this.props.user, moment().format('W'));
    }

    render() {
        return (
            <View>
                <Text>
                    WeekView
                </Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};

export default connect(mapStateToProps, { fetchWeek })(WeekView);

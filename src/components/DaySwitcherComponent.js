import React, { Component } from 'react';
import {
    Text,
    View,
    Button
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectDay } from '../actions';

class DaySwitcher extends Component {
    selectPrevDay(){
        let prevDay = moment().day(this.props.selectedDay).week(this.props.currentWeek).subtract(1, 'day').format('ddd');
        this.props.selectDay(prevDay);
    }

    selectNextDay(){
        let nextDay = moment().day(this.props.selectedDay).week(this.props.currentWeek).add(1, 'day').format('ddd');
        this.props.selectDay(nextDay);
    }

    renderPrevButton() {
        if (this.props.selectedDay === 'mon') {
            return null;
        }
        return (
            <Button
                onPress={this.selectPrevDay.bind(this)}
                title="<"
                color="#841584"
                accessibilityLabel="Previous Day"
            />
        );
    }

    renderNextButton() {
        if (this.props.selectedDay === 'fri') {
            return null;
        }
        return (
            <Button
                onPress={this.selectNextDay.bind(this)}
                title=">"
                color="#841584"
                accessibilityLabel="Next Day"
            />
        );
    }

    render() {
        return (
            <View style={styles.bottomBar}>
                {this.renderPrevButton()}
                <Text>{this.props.day}</Text>
                {this.renderNextButton()}
            </View>
        );
    }
}

const styles = {
    bottomBar: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        flex: 1
    }
};

const mapStateToProps = state => {
    return {
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay
    }
};

export default connect(mapStateToProps, { selectDay })(DaySwitcher);

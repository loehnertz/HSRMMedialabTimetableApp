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
    selectNextDay(){
        let nextDay = moment().day(this.props.selectedDay).week(this.props.currentWeek).add(1, 'day').format('ddd');
        this.props.selectDay(nextDay);
    }

    selectPrevDay(){
        let prevDay = moment().day(this.props.selectedDay).week(this.props.currentWeek).subtract(1, 'day').format('ddd');
        this.props.selectDay(prevDay);
    }

    render() {
        return (
            <View style={styles.bottomBar}>
                <Button
                    onPress={this.selectPrevDay.bind(this)}
                    title="<"
                    color="#841584"
                    accessibilityLabel="Previous Day"
                />
                <Text>{this.props.day}</Text>
                <Button
                    onPress={this.selectNextDay.bind(this)}
                    title=">"
                    color="#841584"
                    accessibilityLabel="Next Day"
                />
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

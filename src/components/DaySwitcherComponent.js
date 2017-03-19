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
            return (
                <Button
                    onPress={this.selectPrevDay.bind(this)}
                    title="  <  "
                    color="#841584"
                    accessibilityLabel="Previous Day"
                    disabled={true}
                />
            );
        }
        return (
            <Button
                onPress={this.selectPrevDay.bind(this)}
                title="  <  "
                color="#841584"
                accessibilityLabel="Previous Day"
            />
        );
    }

    renderNextButton() {
        if (this.props.selectedDay === 'fri') {
            return (
                <Button
                    onPress={this.selectNextDay.bind(this)}
                    title="  >  "
                    color="#841584"
                    accessibilityLabel="Next Day"
                    disabled={true}
                />
            );
        }
        return (
            <Button
                onPress={this.selectNextDay.bind(this)}
                title="  >  "
                color="#841584"
                accessibilityLabel="Next Day"
            />
        );
    }

    render() {
        return (
            <View style={styles.bottomBar}>
                {this.renderPrevButton()}
                <Text style={styles.bottomBarText}>{this.props.day}</Text>
                {this.renderNextButton()}
            </View>
        );
    }
}

const styles = {
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#CCCCCC",
        padding: 20
    },
    bottomBarText: {
        fontSize: 18
    }
};

const mapStateToProps = state => {
    return {
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay
    }
};

export default connect(mapStateToProps, { selectDay })(DaySwitcher);

import React, { Component } from 'react';
import {
    Text,
    View,
    Button
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

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
                    color="#E10019"
                    accessibilityLabel={i18n.t('previous') + ' ' + i18n.t('day')}
                    disabled={true}
                />
            );
        }
        return (
            <Button
                onPress={this.selectPrevDay.bind(this)}
                title="  <  "
                color="#E10019"
                accessibilityLabel={i18n.t('previous') + ' ' + i18n.t('week')}
            />
        );
    }

    renderNextButton() {
        if (this.props.selectedDay === 'fri') {
            return (
                <Button
                    onPress={this.selectNextDay.bind(this)}
                    title="  >  "
                    color="#E10019"
                    accessibilityLabel={i18n.t('next') + ' ' + i18n.t('week')}
                    disabled={true}
                />
            );
        }
        return (
            <Button
                onPress={this.selectNextDay.bind(this)}
                title="  >  "
                color="#E10019"
                accessibilityLabel={i18n.t('next') + ' ' + i18n.t('week')}
            />
        );
    }

    render() {
        return (
            <View style={styles.bottomBar}>
                {/*{this.renderPrevButton()}*/}
                <Text style={styles.bottomBarText}>{this.props.day}</Text>
                {/*{this.renderNextButton()}*/}
            </View>
        );
    }
}

i18n.locale = 'de';
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        borderTopWidth: 1,
        borderTopColor: "#CCCCCC",
        height: 55,
        padding: 10
    },
    bottomBarText: {
        fontSize: 20,
        fontWeight: "bold"
    }
};

const mapStateToProps = state => {
    return {
        currentWeek: state.timetable.currentWeek,
        selectedDay: state.timetable.selectedDay
    }
};

export default connect(mapStateToProps, { selectDay })(DaySwitcher);

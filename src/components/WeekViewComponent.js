import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    Button,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { fetchWeek } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class WeekView extends Component {
    componentDidMount() {
        Actions.refresh({key: 'timetable', title: i18n.t('week_view')});
    }

    renderTimeslots() {
        let slots = this.props.slots;
        slots.splice(0, 1);

        return slots.map((slots) =>
            <Text key={slots.start}>
                {slots.start} - {slots.end}
            </Text>
        );
    }

    render() {
        return (
            <View style={styles.flex}>
                <View>
                    {this.renderTimeslots()}
                </View>
            </View>
        );
    }
}

i18n.locale = 'de';
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    flex: {
        flex: 1
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        masterdata: state.timetable.masterdata,
        slots: state.timetable.timeslots,
        currentWeek: state.timetable.currentWeek,
        semester: state.settings.semester,
        special_subject: state.settings.special_subject
    }
};

export default connect(mapStateToProps, { fetchWeek })(WeekView);

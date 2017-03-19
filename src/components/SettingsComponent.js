import React, { Component } from 'react';
import {
    View,
    Text,
    Picker
} from 'react-native';
import {
    Card,
    CardSection,
    Button
} from './common';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { fetchWeek, selectDay } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class Settings extends Component {
    render() {
        return (
            <Card style={{ flex: 1 }}>
                <CardSection>
                    <Button>
                        Speichern
                    </Button>
                </CardSection>
            </Card>
        );
    }
}

i18n.locale = 'de';
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    settingsSection: {
        flexDirection: "row",
        alignItems: "center"
    },
    settingsText: {
        color: "black",
        fontSize: 16
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};

export default connect(mapStateToProps, {})(Settings);

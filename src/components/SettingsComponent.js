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
import { saveSettings } from '../actions';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class Settings extends Component {
    componentWillMount() {
        this.setState({special_subject: this.props.special_subject});
    }

    renderSpecialSubject() {
        switch (this.props.user) {
            case 'bmm4':
                return (
                    <CardSection style={styles.settingsSection}>
                        {this.renderSpecialSubjectText()}
                        <Picker
                            selectedValue={this.state.special_subject}
                            onValueChange={(subject) => this.setState({special_subject: subject})}
                            style={styles.settingsPicker}
                        >
                            <Picker.Item label="Alle Schwerpunkte" value="all" />
                            <Picker.Item label="Interaktive Medien" value="im" />
                            <Picker.Item label="AV-Medien" value="av" />
                        </Picker>
                    </CardSection>
                );
            default:
                return null;
        }
    }

    renderSpecialSubjectText() {
        return (
            <Text style={styles.settingsText}>
                Schwerpunkt:
            </Text>
        );
    }

    onSaveButtonPress() {
        this.props.saveSettings({
            special_subject: this.state.special_subject
        });
    }

    render() {
        return (
            <Card style={{ flex: 1 }}>
                {this.renderSpecialSubject()}
                <CardSection>
                    <Button onPress={this.onSaveButtonPress.bind(this)}>
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
        alignItems: "center",
        justifyContent: "space-around"
    },
    settingsText: {
        flex: 1,
        color: "black",
        fontSize: 16
    },
    settingsPicker: {
        flex: 2
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        special_subject: state.timetable.special_subject
    }
};

export default connect(mapStateToProps, { saveSettings })(Settings);

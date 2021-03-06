import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Picker,
    Switch,
    Linking,
    Platform
} from 'react-native';
import {
    Card,
    CardSection,
    Button
} from './common';
import { connect } from 'react-redux';
import { saveSettings } from '../actions';
// import { SPECIAL_SUBJECTS } from '../actions/defaults';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class Settings extends Component {
    componentWillMount() {
        this.setState({
            semester: this.props.semester,
            special_subject: this.props.special_subject,
            scrollToTimeslot: this.props.scrollToTimeslot,
            hidePastEvents: this.props.hidePastEvents
        });
    }

    renderSemester() {
        let semesters = Object.values(JSON.parse(this.props.masterdata)["programs"][this.props.program]["targetgroups"]);
        let semesterPicker = semesters.map((semester) =>
            <Picker.Item label={semester} value={semester.substr(0, 1)} key={semester.substr(0, 1)} />
        );

        return (
            <CardSection style={styles.settingsSection}>
                <Text style={styles.settingsText}>Semester:</Text>
                <Picker
                    selectedValue={this.state.semester}
                    onValueChange={(semester) => this.setState({semester: semester})}
                    style={styles.settingsPicker}
                >
                    {semesterPicker}
                </Picker>
            </CardSection>
        );
    }

    renderSpecialSubject() {
        /*
            This caused a bug in React Native which was fixed here: https://github.com/facebook/react-native/pull/8153
            It will probably be released to some future version, until then I will use the legacy code.
            The lines involved at the moment are: 14, 52-54, 70
        */
        /*let special_subjectPicker = SPECIAL_SUBJECTS[this.props.program].map((special_subject) =>
            <Picker.Item label={special_subject["longname"]} value={special_subject["shortname"]} key={special_subject["shortname"]} />
        );*/

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
                            {/*{special_subjectPicker}*/}
                        </Picker>
                    </CardSection>
                );
            case 'bmm5':
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
                            {/*{special_subjectPicker}*/}
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

    renderHidePastEvents() {
        return (
            <CardSection style={styles.settingsSection}>
                <Text style={styles.settingsText}>
                    {i18n.t('hide_past_events')}:
                </Text>
                <Switch
                    onValueChange={(value) => this.setState({hidePastEvents: value})}
                    value={this.state.hidePastEvents}
                    style={styles.settingsSwitch}
                />
            </CardSection>
        );
    }

    onSaveButtonPress() {
        this.props.saveSettings({
            temp: {semester: this.state.semester},
            perm: {
                special_subject: this.state.special_subject,
                scrollToTimeslot: this.state.scrollToTimeslot,
                hidePastEvents: this.state.hidePastEvents
            }
        });
    }

    renderScrollToTimeslot() {
        return (
            <CardSection style={styles.settingsSection}>
                <Text style={styles.settingsText}>
                    {i18n.t('scroll_to_time_slot')}:
                </Text>
                <Switch
                    onValueChange={(value) => this.setState({scrollToTimeslot: value})}
                    value={this.state.scrollToTimeslot}
                    style={styles.settingsSwitch}
                />
            </CardSection>
        );
    }

    renderWeekViewSection() {
        // TODO: Activate this once milestone 2 is finished (https://github.com/loehnertz/HSRMMedialabTimetableApp/milestone/2)
        if (Platform.OS === 'android') {
            return (
                <View>
                    <CardSection style={styles.settingsSection}>
                        <Text style={styles.settingsHeaderText}>{i18n.t('week_view')}</Text>
                    </CardSection>
                    {this.renderScrollToTimeslot()}
                </View>
            );
        }
    }

    renderFooterPlatform() {
        if (Platform.OS === 'android') {
            return i18n.t('developed_by');
        } else if (Platform.OS === 'ios') {
            return i18n.t('by');
        }
    }

    render() {
        return (
            <ScrollView style={styles.scrollViewContainer}>
                <Card style={{ flex: 1 }}>
                    <CardSection style={styles.settingsSection}>
                        <Text style={styles.settingsHeaderText}>{i18n.t('general')}</Text>
                    </CardSection>
                    {this.renderSemester()}
                    {this.renderSpecialSubject()}

                    <CardSection style={styles.settingsSection}>
                        <Text style={styles.settingsHeaderText}>{i18n.t('day_view')}</Text>
                    </CardSection>
                    {this.renderHidePastEvents()}

                    {this.renderWeekViewSection()}

                    <CardSection>
                        <Button onPress={this.onSaveButtonPress.bind(this)}>
                            Speichern
                        </Button>
                    </CardSection>
                    <CardSection style={styles.noticeFooter}>
                        <View style={styles.noticeFooterContainer}>
                            <Text style={styles.noticeFooterText}>
                                {this.renderFooterPlatform()} Jakob Löhnertz (
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.jakob.codes/')}>
                                <Text style={[styles.noticeFooterText, styles.hyperlinkText]}>www.jakob.codes</Text>
                            </TouchableOpacity>
                            <Text style={styles.noticeFooterText}>
                                )
                            </Text>
                        </View>
                        <View style={styles.noticeFooterContainer}>
                            <Text style={styles.noticeFooterText}>
                                {i18n.t('code_licensed_under')}
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/loehnertz/HSRMMedialabTimetableApp/blob/master/LICENSE')}>
                                <Text style={[styles.noticeFooterText, styles.hyperlinkText]}> MIT License</Text>
                            </TouchableOpacity>
                        </View>
                    </CardSection>
                </Card>
            </ScrollView>
        );
    }
}

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    scrollViewContainer: {
        marginTop: (Platform.OS === 'ios') ? 10 : 0
    },
    settingsSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    settingsHeaderText: {
        color: "black",
        fontSize: 19,
        fontWeight: "bold",
        paddingTop: 5,
        paddingBottom: 5
    },
    settingsText: {
        flex: 1,
        color: "black",
        fontSize: 16,
        marginLeft: 10
    },
    settingsPicker: {
        flex: 2
    },
    settingsSwitch: {
        marginLeft: 10,
        marginRight: 15
    },
    noticeFooter: {
        flexDirection: "column",
        alignItems: "center"
    },
    noticeFooterContainer: {
        flexDirection: "row"
    },
    noticeFooterText: {
        fontSize: 14,
        fontWeight: "bold"
    },
    hyperlinkText: {
        color: "#E10019"
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        masterdata: state.timetable.masterdata,
        semester: state.settings.semester,
        special_subject: state.settings.special_subject,
        scrollToTimeslot: state.settings.scrollToTimeslot,
        hidePastEvents: state.settings.hidePastEvents
    }
};

export default connect(mapStateToProps, { saveSettings })(Settings);

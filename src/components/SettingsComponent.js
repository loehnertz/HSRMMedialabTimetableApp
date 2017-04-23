import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    Picker,
    Switch
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
            lecture_group: this.props.lecture_group,
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
                            onValueChange={(subject) => this.setState({ special_subject: subject })}
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

    renderGroup() {
        return (
            <CardSection style={styles.settingsSection}>
                {this.renderLectureGroupText()}
                <Picker
                    selectedValue={this.state.lecture_group}
                    onValueChange={(group) => this.setState({ lecture_group: group })}
                    style={styles.settingsPicker}
                >
                    <Picker.Item label="Alle Gruppen" value="all" />
                    <Picker.Item label="Gruppe A" value="A" />
                    <Picker.Item label="Gruppe B" value="B" />
                    <Picker.Item label="Gruppe C" value="C" />
                    <Picker.Item label="Gruppe D" value="D" />
                    <Picker.Item label="Gruppe E" value="E" />
                </Picker>
            </CardSection>
        );
    }

    renderSpecialSubjectText() {
        return (
            <Text style={styles.settingsText}>
                Schwerpunkt:
            </Text>
        );
    }

    renderLectureGroupText() {
        return (
            <Text style={styles.settingsText}>
                Gruppe:
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

    onSaveButtonPress() {
        this.props.saveSettings({
            temp: {
                semester: this.state.semester
            },
            perm: {
                special_subject: this.state.special_subject,
                lecture_group: this.state.lecture_group,
                scrollToTimeslot: this.state.scrollToTimeslot,
                hidePastEvents: this.state.hidePastEvents
            }
        });
    }

    render() {
        return (
            <ScrollView>
                <Card style={{ flex: 1 }}>
                    <CardSection style={styles.settingsSection}>
                        <Text style={styles.settingsHeaderText}>{i18n.t('general')}</Text>
                    </CardSection>
                    {this.renderSemester()}
                    {this.renderSpecialSubject()}
                    {this.renderGroup()}

                    <CardSection style={styles.settingsSection}>
                        <Text style={styles.settingsHeaderText}>{i18n.t('day_view')}</Text>
                    </CardSection>
                    {this.renderHidePastEvents()}

                    <CardSection style={styles.settingsSection}>
                        <Text style={styles.settingsHeaderText}>{i18n.t('week_view')}</Text>
                    </CardSection>
                    {this.renderScrollToTimeslot()}

                    <CardSection>
                        <Button onPress={this.onSaveButtonPress.bind(this)}>
                            Speichern
                        </Button>
                    </CardSection>
                </Card>
            </ScrollView>
        );
    }
}

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
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
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        masterdata: state.timetable.masterdata,
        semester: state.settings.semester,
        special_subject: state.settings.special_subject,
        lecture_group: state.settings.lecture_group,
        scrollToTimeslot: state.settings.scrollToTimeslot,
        hidePastEvents: state.settings.hidePastEvents
    }
};

export default connect(mapStateToProps, { saveSettings })(Settings);

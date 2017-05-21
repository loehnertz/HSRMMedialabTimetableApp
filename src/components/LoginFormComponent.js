import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    AsyncStorage,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as Keychain from 'react-native-keychain';
import Orientation from 'react-native-orientation';
import {
    userChanged,
    passwordChanged,
    loginUser,
    setOrientation,
    endLoading
} from '../actions'
import {
    Card,
    CardSection,
    Button,
    Input
} from './common';
import i18n from 'react-native-i18n';
import bundledTranslations from '../translations';

class LoginForm extends Component {
    state = {
        heightScrollView: -1
    };

    componentWillMount() {
        if (this.props.logout) {
            Keychain.resetGenericPassword()
                .then(() => {
                    AsyncStorage.removeItem('masterdata');
                    AsyncStorage.removeItem('settings');
                    Actions.auth({ type: 'reset' });
                    this.props.endLoading();
                });
        }

        this.props.setOrientation(Orientation.getInitialOrientation());
    }

    componentDidMount() {
        // The orientation on iOS causes several bugs. Therefore, I decided to not ship the (landscape) 'WeekView' before the major bugs are fixed
        if (Platform.OS === 'ios') {
            Orientation.lockToPortrait();
            this.props.setOrientation('PORTRAIT');
        }

        if (Platform.OS !== 'ios') {
            Orientation.addOrientationListener(this._orientationDidChange);  // Add a listener for the change of the device orientation
        }
    }

    _orientationDidChange = (changedOrientation) => {
        this.props.setOrientation(changedOrientation);
    };

    onUserChange(text) {
        this.props.userChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onButtonPress() {
        this.props.loginUser(this.props.user, this.props.password);
    }

    renderButton() {
        if (this.props.loading) {
            return (
                <View style={styles.spinner}>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        }

        return (
            <Button onPress={this.onButtonPress.bind(this)}>
                Login
            </Button>
        );
    }

    setViewHeight() {
        if (this.state.heightScrollView !== -1) {
            if (this.props.orientation === 'PORTRAIT') {
                return ({ height: this.state.heightScrollView - 55 });
            } else if (this.props.orientation === 'LANDSCAPE') {
                return ({ height: this.state.heightScrollView + 55 });
            }
        }
    }

    renderErrorNotice() {
        if (this.props.error.length > 0) {
            return (
                <CardSection>
                    <Text style={styles.errorText}>
                        {this.props.error}
                    </Text>
                </CardSection>
            );
        } else {
            return (null);
        }
    }

    renderFooterPlatform() {
        if (Platform.OS === 'android') {
            return i18n.t('developed_by');
        } else if (Platform.OS === 'ios') {
            return i18n.t('by');
        }
    }

    render () {
        return (
            <ScrollView onLayout={(layout) => this.setState({ heightScrollView: layout.nativeEvent.layout.height })}>
                <View style={this.setViewHeight()}>
                    <Card style={styles.mainCard}>
                        <CardSection>
                            <Text style={styles.noticeText}>
                                {i18n.t('login_notice')}
                            </Text>
                        </CardSection>

                        <CardSection>
                            <Input
                                label={i18n.t('username')}
                                placeholder=""
                                onChangeText={this.onUserChange.bind(this)}
                                value={this.props.user}
                            />
                        </CardSection>

                        <CardSection>
                            <Input
                                secureTextEntry
                                label={i18n.t('password')}
                                placeholder=""
                                onChangeText={this.onPasswordChange.bind(this)}
                                value={this.props.password}
                            />
                        </CardSection>

                        {this.renderErrorNotice()}

                        <CardSection>
                            {this.renderButton()}
                        </CardSection>
                    </Card>
                </View>

                <View style={styles.noticeFooter}>
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
                </View>
            </ScrollView>
        );
    }
}

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    errorText: {
        alignSelf: "center",
        color: "red"
    },
    mainCard: {
        marginTop: (Platform.OS === 'ios') ? 20 : 10,
    },
    noticeText: {
        fontWeight: "bold"
    },
    noticeFooter: {
        flexDirection: "column",
        alignItems: "center",
        height: 55
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
    },
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

const mapStateToProps = state => {
    return {
        user: state.login.userField,
        password: state.login.passwordField,
        error: state.login.error,
        loading: state.login.loadingLogin,
        orientation: state.timetable.orientation
    }
};

export default connect(mapStateToProps, {
    userChanged,
    passwordChanged,
    loginUser,
    setOrientation,
    endLoading
})(LoginForm);

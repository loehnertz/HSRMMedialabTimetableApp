import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as Keychain from 'react-native-keychain';
import Orientation from 'react-native-orientation';
import {
    userChanged,
    passwordChanged,
    loginUser,
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

        let initialOrientation = Orientation.getInitialOrientation();
        if (initialOrientation === 'PORTRAIT') {
            this.setState({ orientation: initialOrientation });
        } else if (initialOrientation === 'LANDSCAPE') {
            this.setState({ orientation: initialOrientation });
        }

        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (changedOrientation) => {
        if (changedOrientation === 'PORTRAIT') {
            this.setState({ orientation: changedOrientation });
        } else if (changedOrientation === 'LANDSCAPE') {
            this.setState({ orientation: changedOrientation });
        }
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
            if (this.state.orientation === 'PORTRAIT') {
                return ({ height: this.state.heightScrollView - 55 });
            } else if (this.state.orientation === 'LANDSCAPE') {
                return ({ height: this.state.heightScrollView + 55 });
            }
        }
    }

    render () {
        return (
            <ScrollView onLayout={(layout) => this.setState({ heightScrollView: layout.nativeEvent.layout.height })}>
                <View style={this.setViewHeight()}>
                    <Card>
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

                        <CardSection>
                            <Text style={styles.errorText}>
                                {this.props.error}
                            </Text>
                        </CardSection>

                        <CardSection>
                            {this.renderButton()}
                        </CardSection>
                    </Card>
                </View>

                <View style={styles.noticeFooter}>
                    <View style={styles.noticeFooterContainer}>
                        <Text style={styles.noticeFooterText}>
                            {i18n.t('developed_by')} Jakob Löhnertz (
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
        loading: state.login.loadingLogin
    }
};

export default connect(mapStateToProps, {
    userChanged,
    passwordChanged,
    loginUser,
    endLoading
})(LoginForm);

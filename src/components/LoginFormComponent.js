import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as Keychain from 'react-native-keychain';
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
    }

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

    render () {
        return (
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
        );
    }
}

i18n.locale = 'de';
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

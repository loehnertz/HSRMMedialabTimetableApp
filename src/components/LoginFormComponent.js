import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    ActivityIndicator,
    Text
} from 'react-native';
import {
    userChanged,
    passwordChanged,
    loginUser
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
                <View>
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
    loginUser
})(LoginForm);

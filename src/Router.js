import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { fetchWeek, selectDay } from './actions';
import i18n from 'react-native-i18n';
import bundledTranslations from './translations';
import Startup from './components/StartupComponent';
import LoginForm from './components/LoginFormComponent';
import Timetable from './components/TimetableComponent';
import Settings from './components/SettingsComponent';

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

class RouterComponent extends Component {
    render() {
        return (
            <Router sceneStyle={{ paddingTop: 55 }}>
                <Scene key="startup" inital>
                    <Scene key="loading" component={Startup} title={i18n.t('loading')} />
                </Scene>
                <Scene key="auth">
                    <Scene key="login" component={LoginForm} title={i18n.t('login')} />
                </Scene>
                <Scene key="main">
                    <Scene
                        key="timetable"
                        component={Timetable}
                        title={i18n.t('day_view')}
                        rightTitle="Einstellungen"
                        onRight={() => Actions.settings()}
                    />
                    <Scene
                        key="settings"
                        component={Settings}
                        title={i18n.t('settings')}
                        initial
                    />
                </Scene>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user,
        program: state.login.program,
        currentWeek: state.timetable.currentWeek
    }
};

export default connect(mapStateToProps, { fetchWeek, selectDay })(RouterComponent);
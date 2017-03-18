import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import bundledTranslations from './translations';
import Startup from './components/StartupComponent';
import LoginForm from './components/LoginFormComponent';
import WeekView from './components/WeekView';

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const RouterComponent = () => {
    return (
        <Router sceneStyle={{ paddingTop: 55 }}>
            <Scene key="startup" inital>
                <Scene key="loading" component={Startup} title={i18n.t('loading')} />
            </Scene>
            <Scene key="auth">
                <Scene key="login" component={LoginForm} title={i18n.t('login')} />
            </Scene>
            <Scene key="main">
                <Scene key="weekView" component={WeekView} title={i18n.t('week_view')} />
            </Scene>
        </Router>
    );
};

export default RouterComponent;

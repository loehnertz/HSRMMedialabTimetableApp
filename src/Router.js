import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import bundledTranslations from './translations';
import Startup from './components/StartupComponent';
import LoginForm from './components/LoginFormComponent';

i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const RouterComponent = () => {
    return (
        <Router sceneStyle={{ paddingTop: 60 }}>
            <Scene key="auth">
                <Scene key="login" component={LoginForm} title={i18n.t('please_login')} />
            </Scene>
            <Scene key="startup">
                <Scene key="loading" component={Startup} title="Loading" />
            </Scene>
        </Router>
    );
};

export default RouterComponent;

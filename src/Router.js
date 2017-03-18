import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scene, Router } from 'react-native-router-flux';
import { fetchWeek } from './actions';
import i18n from 'react-native-i18n';
import bundledTranslations from './translations';
import Startup from './components/StartupComponent';
import LoginForm from './components/LoginFormComponent';
import Timetable from './components/TimetableComponent';

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
                        leftTitle="Vorherige"
                        onLeft={() => this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek - 1))}
                        rightTitle="Nächste"
                        onRight={() => this.props.fetchWeek(this.props.user, this.props.program, (this.props.currentWeek + 1))}
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

export default connect(mapStateToProps, { fetchWeek })(RouterComponent);

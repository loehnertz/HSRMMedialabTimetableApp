import { Actions } from 'react-native-router-flux';
import {
    AsyncStorage,
    Platform,
    NetInfo
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {
    USER_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOADING_START,
    LOADING_END
} from './types';
import { DEFAULT_SETTINGS } from './defaults';

export const userChanged = (text) => {
    return {
        type: USER_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const isUserLoggedIn = () => {
    return (dispatch) => {
        NetInfo.fetch().done((reach) => {
            switch (Platform.OS) {
                case 'android':
                    if (reach === 'NONE') {
                        dispatch({
                            type: LOGIN_USER_FAILED,
                            payload: 'no_connection'
                        });
                        return null;
                    }
                    break;
                case 'ios':
                    if (reach === 'none') {
                        dispatch({
                            type: LOGIN_USER_FAILED,
                            payload: 'no_connection'
                        });
                        return null;
                    }
                    break;
            }
        });

        Keychain.getGenericPassword()
            .then((credentials) => {
                if (credentials) {
                    fetch('https://hsrm-medialab.de/osp/server/functions.php', {
                        method: 'POST',
                        body: `request=login&timestamp=${Date.now()}&editor=anonymous&user=${credentials.username}&password=${credentials.password}`,
                        headers: {
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.message === "login successful") {
                                dispatch({
                                    type: LOGIN_USER_SUCCESS,
                                    username: credentials.username,
                                    program: credentials.username.slice(0, -1)
                                });
                            } else {
                                dispatch({
                                    type: LOGIN_USER_FAILED,
                                    payload: 'login_failed'
                                });
                                Actions.auth({ type: 'reset' });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            dispatch({ type: LOADING_END });
                            Actions.auth({ type: 'reset' });
                        });
                } else {
                    dispatch({ type: LOADING_END });
                    Actions.auth({ type: 'reset' });
                }
            })
            .catch(() => {
                dispatch({ type: LOADING_END });
                Actions.auth({ type: 'reset' });
            });
    };
};

export const loginUser = (user, password) => {
    return (dispatch) => {
        dispatch({ type: LOADING_START });

        NetInfo.fetch().done((reach) => {
            switch (Platform.OS) {
                case 'android':
                    if (reach === 'NONE') {
                        dispatch({
                            type: LOGIN_USER_FAILED,
                            payload: 'no_connection'
                        });
                        return null;
                    }
                    break;
                case 'ios':
                    if (reach === 'none') {
                        dispatch({
                            type: LOGIN_USER_FAILED,
                            payload: 'no_connection'
                        });
                        return null;
                    }
                    break;
            }
        });

        fetch('https://hsrm-medialab.de/osp/server/functions.php', {
            method: 'POST',
            body: `request=login&timestamp=${Date.now()}&editor=anonymous&user=${user}&password=${password}`,
            headers: {
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.message === "login successful") {
                    fetch('https://hsrm-medialab.de/osp/server/functions.php', {
                        method: 'POST',
                        body: `request=get-masterdata&timestamp=${Date.now()}&editor=${user}`,
                        headers: {
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    })
                        .then((response) => response.json())
                        .then(async (responseJson) => {
                            try {
                                await AsyncStorage.setItem('masterdata', JSON.stringify(responseJson));
                                await AsyncStorage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS));
                                await Keychain.setGenericPassword(user, password);

                                let program = '';
                                if (user.includes('@')) {
                                    program = 'bmm';
                                } else {
                                    program = user.slice(0, -1);
                                }
                                dispatch({
                                    type: LOGIN_USER_SUCCESS,
                                    username: user,
                                    program: program
                                });
                                Actions.startup({ type: 'reset' });
                            } catch (error) {
                                console.log(error);
                                dispatch({
                                    type: LOGIN_USER_FAILED,
                                    payload: 'login_failed'
                                });
                                Actions.auth({ type: 'reset' });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            dispatch({
                                type: LOGIN_USER_FAILED,
                                payload: 'login_failed'
                            });
                            Actions.auth({ type: 'reset' });
                        });
                } else {
                    dispatch({
                        type: LOGIN_USER_FAILED,
                        payload: 'login_failed'
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch({
                    type: LOGIN_USER_FAILED,
                    payload: 'login_failed'
                });
                Actions.auth({ type: 'reset' });
            });
    };
};

export const endLoading = () => {
    return { type: LOADING_END };
};

import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';
import {
    USER_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOADING_START
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
                                Actions.main({ type: 'reset' });
                            } else {
                                dispatch({ type: LOGIN_USER_FAILED });
                                Actions.auth({ type: 'reset' });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            Actions.auth({ type: 'reset' });
                        });
                } else {
                    Actions.auth({ type: 'reset' });
                }
            })
            .catch(() => {
                Actions.auth({ type: 'reset' });
            });
    };
};

export const loginUser = (user, password) => {
    return (dispatch) => {
        dispatch({ type: LOADING_START });

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
                                dispatch({
                                    type: LOGIN_USER_SUCCESS,
                                    username: user,
                                    program: user.slice(0, -1)
                                });
                                Actions.main({ type: 'reset' });
                            } catch (error) {
                                console.log(error);
                                dispatch({ type: LOGIN_USER_FAILED });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            Actions.auth({ type: 'reset' });
                        });
                } else {
                    dispatch({ type: LOGIN_USER_FAILED });
                }
            })
            .catch((error) => {
                console.log(error);
                Actions.auth({ type: 'reset' });
            });
    };
};

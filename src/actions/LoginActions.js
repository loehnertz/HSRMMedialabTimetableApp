import {
    USER_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOADING_START
} from './types';

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
                    dispatch({ type: LOGIN_USER_SUCCESS });
                } else {
                    dispatch({ type: LOGIN_USER_FAILED });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

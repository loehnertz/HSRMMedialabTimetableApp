import {
    USER_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOADING_START,
    LOADING_END
} from '../actions/types';

const INITIAL_STATE = {
    userField: '',
    passwordField: '',
    error: '',
    user: '',
    loadingLogin: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_CHANGED:
            return { ...state, userField: action.payload };
        case PASSWORD_CHANGED:
            return { ...state, passwordField: action.payload };
        case LOADING_START:
            return { ...state, loadingLogin: true, error: "" };
        case LOADING_END:
            return { ...state, loadingLogin: false };
        case LOGIN_USER_SUCCESS:
            return { ...state, error: "", userField: "", passwordField:  "", user: action.payload, loadingLogin: false };
        case LOGIN_USER_FAILED:
            return { ...state, error: i18n.t('login_failed'), passwordField:  "", loadingLogin: false };
        default:
            return state;
    }
};
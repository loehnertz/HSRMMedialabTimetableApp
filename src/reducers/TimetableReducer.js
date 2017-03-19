import {
    LOADING_START,
    WEEK_SET,
    WEEK_FETCH_SUCCESS,
    WEEK_FETCH_FAILED,
    MASTERDATA_SAVED,
    SETTINGS_SAVED
} from '../actions/types';

const INITIAL_STATE = {
    currentWeek: '',
    fetchedWeek: '',
    errorFetch: '',
    special_subject: '',
    loadingFetch: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case WEEK_SET:
            return { ...state, currentWeek: action.payload };
        case WEEK_FETCH_SUCCESS:
            return { ...state, fetchedWeek: action.payload, loadingFetch: false };
        case WEEK_FETCH_FAILED:
            return { ...state, errorFetch: "Something went wrong!", loadingFetch: false };
        case MASTERDATA_SAVED:
            return { ...state, masterdata: action.payload };
        case SETTINGS_SAVED:
            return { ...state, special_subject: action.payload["special_subject"] };
        case LOADING_START:
            return { ...state, errorFetch: "", loadingFetch: true};
        default:
            return state;
    }
};

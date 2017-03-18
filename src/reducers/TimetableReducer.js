import {
    LOADING_START,
    WEEK_SET,
    WEEK_FETCH_SUCCESS,
    WEEK_FETCH_FAILED,
    DAY_SELECTED
} from '../actions/types';

const INITIAL_STATE = {
    currentWeek: '',
    fetchedWeek: '',
    selectedDay: '',
    errorFetch: '',
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
        case DAY_SELECTED:
            return { ...state, selectedDay: action.payload };
        case LOADING_START:
            return { ...state, errorFetch: "", loadingFetch: true};
        default:
            return state;
    }
};

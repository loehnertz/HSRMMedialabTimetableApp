import {
    LOADING_START,
    LOADING_END,
    WEEK_SET,
    WEEK_FETCH_SUCCESS,
    WEEK_FETCH_FAILED,
    DAY_SELECTED,
    MASTERDATA_DISPATCHED,
    TIMESLOTS_DISPATCHED,
    ORIENTATION_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
    currentWeek: '',
    fetchedWeek: '',
    selectedDay: '',
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
        case MASTERDATA_DISPATCHED:
            return { ...state, masterdata: action.payload };
        case TIMESLOTS_DISPATCHED:
            return { ...state, timeslots: action.payload };
        case DAY_SELECTED:
            return { ...state, selectedDay: action.payload };
        case ORIENTATION_CHANGED:
            return { ...state, orientation: action.payload };
        case LOADING_START:
            return { ...state, errorFetch: "", loadingFetch: true};
        case LOADING_END:
            return { ...state, errorFetch: "", loadingFetch: false};
        default:
            return state;
    }
};

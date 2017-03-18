import {
    LOADING_START,
    WEEK_FETCH_SUCCESS,
    WEEK_FETCH_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    fetchedWeek: '',
    errorFetch: '',
    loadingFetch: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case WEEK_FETCH_SUCCESS:
            return { ...state, fetchedWeek: action.payload, loadingFetch: false };
        case WEEK_FETCH_FAILED:
            return { ...state, errorFetch: "Something went wrong!", loadingFetch: false };
        case LOADING_START:
            return { ...state, errorFetch: "", loadingFetch: true};
        default:
            return state;
    }
};

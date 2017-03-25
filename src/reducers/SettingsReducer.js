import { SETTINGS_DISPATCHED } from '../actions/types';

const INITIAL_STATE = {
    semester: '',
    special_subject: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETTINGS_DISPATCHED:
            return { ...state, semester: action.payload["semester"], special_subject: action.payload["special_subject"], hidePastEvents: action.payload["hidePastEvents"] };
        default:
            return state;
    }
};

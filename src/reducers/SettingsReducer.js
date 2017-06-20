import { SETTINGS_DISPATCHED } from '../actions/types';

const INITIAL_STATE = {
    semester: '',
    special_subject: '',
    activatePushNotifications: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETTINGS_DISPATCHED:
            return {
                ...state,
                semester: action.payload["semester"],
                special_subject: action.payload["special_subject"],
                scrollToTimeslot: action.payload["scrollToTimeslot"],
                hidePastEvents: action.payload["hidePastEvents"],
                activatePushNotifications: action.payload["activatePushNotifications"]
            };
        default:
            return state;
    }
};

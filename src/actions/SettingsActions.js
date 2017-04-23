import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SETTINGS_DISPATCHED } from './types';

export const dispatchSettings = (user) => {
    return async (dispatch) => {
        let storageSettings = {};
        await AsyncStorage.getItem('settings')
            .then((item) => JSON.parse(item))
            .then((itemJson) => {
                storageSettings = itemJson;
            })
            .catch((error) => {
                console.log(error);
                Actions.auth({ type: 'reset' });
            });

        dispatch({
            type: SETTINGS_DISPATCHED,
            payload: {
                semester: user.substr(3, 1),
                special_subject: storageSettings["special_subject"],
                lecture_group: storageSettings["lecture_group"],
                scrollToTimeslot: storageSettings["scrollToTimeslot"],
                hidePastEvents: storageSettings["hidePastEvents"]
            }
        });
    };
};

export const saveSettings = (settings) => {
    return async (dispatch) => {
        await AsyncStorage.setItem('settings', JSON.stringify(settings["perm"]));

        dispatch({
            type: SETTINGS_DISPATCHED,
            payload: {
                semester: settings["temp"]["semester"],
                special_subject: settings["perm"]["special_subject"],
                lecture_group: settings["perm"]["lecture_group"],
                scrollToTimeslot: settings["perm"]["scrollToTimeslot"],
                hidePastEvents: settings["perm"]["hidePastEvents"]
            }
        });

        Actions.timetable({ type: 'reset' });
    };
};

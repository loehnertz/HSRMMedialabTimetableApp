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

        let semester = '';
        if (user.includes('@')) {
            semester = '1';
        } else {
            semester = user.substr(3, 1);
        }

        dispatch({
            type: SETTINGS_DISPATCHED,
            payload: {
                semester: semester,
                special_subject: storageSettings["special_subject"],
                scrollToTimeslot: storageSettings["scrollToTimeslot"],
                hidePastEvents: storageSettings["hidePastEvents"],
                activatePushNotifications: storageSettings["activatePushNotifications"]
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
                scrollToTimeslot: settings["perm"]["scrollToTimeslot"],
                hidePastEvents: settings["perm"]["hidePastEvents"],
                activatePushNotifications: settings["perm"]["activatePushNotifications"]
            }
        });

        Actions.timetable({ type: 'reset' });
    };
};

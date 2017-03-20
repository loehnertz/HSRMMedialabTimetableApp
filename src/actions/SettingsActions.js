import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SETTINGS_DISPATCHED } from './types';
import { DEFAULT_SETTINGS } from './defaults';

export const dispatchSettings = () => {
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
                semester: DEFAULT_SETTINGS["semester"],
                special_subject: storageSettings["special_subject"]
            }
        });
    };
};

export const saveSettings = (settings) => {
    return async (dispatch) => {
        console.log(settings);
        await AsyncStorage.setItem('settings', JSON.stringify(settings["perm"]));

        dispatch({
            type: SETTINGS_DISPATCHED,
            payload: {
                semester: settings["temp"]["semester"],
                special_subject: settings["perm"]["special_subject"]
            }
        });

        Actions.timetable({ type: 'reset' });
    };
};

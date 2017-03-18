import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import {
    LOADING_START,
    LOADING_END
} from './types';

export const fetchWeek = (user, week) => {
    return (dispatch) => {
        dispatch({ type: LOADING_START });

        fetch('https://hsrm-medialab.de/osp/server/functions.php', {
            method: 'POST',
            body: `request=get-eventdata&timestamp=${Date.now()}&editor=${user}&kw=kw${week}&program=${user.slice(0, -1)}&target=${user}`,
            headers: {
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                dispatch({ type: LOADING_END });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: LOADING_END });
            });
    };
};

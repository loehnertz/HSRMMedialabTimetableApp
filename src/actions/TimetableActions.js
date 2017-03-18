import { Actions } from 'react-native-router-flux';
import {
    LOADING_START,
    WEEK_FETCH_SUCCESS,
    WEEK_FETCH_FAILED
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
                dispatch({
                    type: WEEK_FETCH_SUCCESS,
                    payload: JSON.stringify(responseJson)
                });
                dispatch({ type: WEEK_FETCH_FAILED });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: WEEK_FETCH_FAILED });
            });
    };
};

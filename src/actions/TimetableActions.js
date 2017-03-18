import { Actions } from 'react-native-router-flux';
import {
    LOADING_START,
    WEEK_SET,
    WEEK_FETCH_SUCCESS,
    WEEK_FETCH_FAILED,
    DAY_SELECTED
} from './types';

export const fetchWeek = (user, program, week) => {
    return (dispatch) => {
        dispatch({ type: LOADING_START });

        fetch('https://hsrm-medialab.de/osp/server/functions.php', {
            method: 'POST',
            body: `request=get-eventdata&timestamp=${Date.now()}&editor=${user}&kw=kw${week}&program=${program}&target=${user}`,
            headers: {
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type: WEEK_SET,
                    payload: parseInt(week)
                });
                dispatch({
                    type: WEEK_FETCH_SUCCESS,
                    payload: JSON.stringify(responseJson)
                });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: WEEK_FETCH_FAILED });
            });
    };
};

export const selectDay = (day) => {
    return (dispatch) => {
        dispatch({
            type: DAY_SELECTED,
            payload: day.toLowerCase()
        });
    };
};

import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
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
} from './types';

export const fetchWeek = (user, program, week, target) => {
    return (dispatch) => {
        dispatch({ type: LOADING_START });

        fetch('https://hsrm-medialab.de/osp/server/functions.php', {
            method: 'POST',
            body: `request=get-eventdata&timestamp=${Date.now()}&editor=${user}&kw=kw${week}&program=${program}&target=${program + target}`,
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

export const selectWeek = (week) => {
    return (dispatch) => {
        dispatch({
            type: WEEK_SET,
            payload: parseInt(week)
        });
    };
};

export const dispatchMasterdata = () => {
    return (dispatch) => {
        AsyncStorage.getItem('masterdata')
            .then((item) => JSON.parse(item))
            .then((itemJson) => {
                dispatch({
                    type: MASTERDATA_DISPATCHED,
                    payload: JSON.stringify(itemJson)
                });
            })
            .catch((error) => {
                console.log(error);
                Actions.auth({ type: 'reset' });
            });
    };
};

export const dispatchTimeslots = (slots) => {
    return (dispatch) => {
        dispatch({
            type: TIMESLOTS_DISPATCHED,
            payload: slots
        });
    };
};

export const setOrientation = (orientation) => {
    return (dispatch) => {
        dispatch({
            type: ORIENTATION_CHANGED,
            payload: orientation
        });
    };
};

export const startLoading = () => {
    return { type: LOADING_START };
};

export const stopLoading = () => {
    return { type: LOADING_END };
};

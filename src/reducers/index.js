import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import TimetableReducer from './TimetableReducer';

export default combineReducers({
    login: LoginReducer,
    timetable: TimetableReducer
});

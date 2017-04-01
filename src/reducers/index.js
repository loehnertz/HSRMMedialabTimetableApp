import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import TimetableReducer from './TimetableReducer';
import SettingsReducer from './SettingsReducer';

export default combineReducers({
    login: LoginReducer,
    timetable: TimetableReducer,
    settings: SettingsReducer
});

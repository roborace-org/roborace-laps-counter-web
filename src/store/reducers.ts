import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';

import initDataReducer from "./initData/reducers";
import socketReducer from "./socket/reducer";
import raceReducer from "./race/reducer";


export default combineReducers({
  form: formReducer,
  initialFormData: initDataReducer,
  socketState: socketReducer,
  race: raceReducer,
});
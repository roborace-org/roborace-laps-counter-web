import { submit } from "redux-form";

export const LOAD_INITDATA_WS = 'redux-form-examples/account/LOAD';

export const loadInitWsData = (formData) => ({ type: LOAD_INITDATA_WS, payload: formData });
export const submitWS = () => submit('wsForm');

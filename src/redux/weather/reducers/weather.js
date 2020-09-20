import * as ActionTypes from '../ActionTypes';

/** 
  * @desc Weather Reducer:
  * Handles all about the interaction with the weather API.
  * @author Maximiliano Goffman
  * @required redux
*/
export const Weather = (state = { isLoading: false,
    errMess: null,
    weather:null}, action) => {
    switch (action.type) {
        case ActionTypes.WEATHER_SET:
            return {...state, isLoading: false, errMess: null, weather: action.payload};
        
        case ActionTypes.WEATHER_UNSET:
            return {...state, isLoading: false, errMess: null, weather: null};
    
        case ActionTypes.WEATHER_LOADING:
            return {...state, isLoading: true, errMess: null}

        case ActionTypes.WEATHER_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
            return state;
    }
};
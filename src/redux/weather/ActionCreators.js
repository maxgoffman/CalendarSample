import * as ActionTypes from './ActionTypes';

const APPID = 'apikey';

/** 
  * @desc Fetch Weather:
  * Fetch data from Api Service.
  * @author Maximiliano Goffman
  * @required redux redux-thunk
*/
export const fetchWeather = (city) => async (dispatch) => {

    dispatch(weatherLoading(true));

    try {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APPID}`);
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      const weather = await response.json();
      dispatch(setWeather(weather.weather[0]));
    } catch(error) {
      dispatch(weatherFailed(error.message));
    }
}

export const weatherLoading = () => ({
    type: ActionTypes.WEATHER_LOADING
});

export const weatherFailed = (errmess) => ({
    type: ActionTypes.WEATHER_FAILED,
    payload: errmess
});

export const setWeather = (weather) => ({
    type: ActionTypes.WEATHER_SET,
    payload: weather
});

export const unsetWeather = () => ({
  type: ActionTypes.WEATHER_UNSET
});

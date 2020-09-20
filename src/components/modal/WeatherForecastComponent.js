import React from "react";
import { useSelector, shallowEqual } from "react-redux";

/** 
  * @desc WeatherForecast
  * Shows weather forecast
  * @author Maximiliano Goffman
  * @required redux
*/
const WeatherForecast = () => {
    const storageProps = useSelector(state => ({
        isLoading:state.weather.isLoading,
        errMess:state.weather.errMess,  
        weather:state.weather.weather
    }), shallowEqual);

    if (storageProps.weather) {
        return (<div><img alt={storageProps.weather.description} src={`http://openweathermap.org/img/wn/${storageProps.weather.icon}.png`} width="50" height="50" /><br/>{storageProps.weather.description}</div>)
    }
    else if (storageProps.errMess){
        return (<React.Fragment>{"Couldn't load Forecast"}</React.Fragment>)
    }
    else if (storageProps.isLoading){
        return (<React.Fragment>{"Loading"}</React.Fragment>)
    }
    else {        
        return (<React.Fragment>{"Fill City to get weather forecast"}</React.Fragment>)
    }
}

export default WeatherForecast;
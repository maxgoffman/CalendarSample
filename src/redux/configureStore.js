import {createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Weather } from './weather/reducers/weather';
import { Options } from './options/reducers/options';
import { Reminders } from './reminders/reducers/reminders';


//Create Redux Store by Combining Reducers and apply Redux-Thunk middleware
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            options: Options,
            weather: Weather,
            reminders: Reminders
        }),
        applyMiddleware(thunk)
    );
    
    return store;
};
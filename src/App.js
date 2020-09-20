import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import './App.scss';
import Calendar from './components/Calendar';

//starts redux store
const store = ConfigureStore();


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Calendar />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

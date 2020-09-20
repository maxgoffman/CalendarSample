import React from "react";
import MonthView from './views/month/MonthViewComponent';
import TimeView from './views/time/TimeViewComponent';
import { Switch, Route, Redirect } from "react-router-dom";

export const localBaseRoute ='/calendar/';


const Calendar = (props) => {
    
    return (
      <div className="calendar">
        <Switch location={props.location}>
          <Route exact path={localBaseRoute} render={MonthView} />
          {/*<Route path={`${baseLocalRoute}cart/`} render={() => CartPage({})} />*/}
          <Route path={`${localBaseRoute}time/`} render={TimeView} />
          <Redirect to={localBaseRoute} />
        </Switch>
      </div>
    );
}
export default Calendar;

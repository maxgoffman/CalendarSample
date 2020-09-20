import React from "react";
import MonthViewHeader from './MonthViewHeaderComponent';
import MonthDaysList from "./MonthDaysListComponent";
import styles from './MonthViewStyles.module.scss';

/** 
  * @desc MonthView
  * Displays a grid with week days names in the header
  * and a list of day numbers below
  * @author Maximiliano Goffman
*/
const MonthView = () => {
    
    return (
        <div className={styles["month-view"]}>
            <MonthViewHeader />
            <MonthDaysList />
        </div>
      );
}

export default MonthView;
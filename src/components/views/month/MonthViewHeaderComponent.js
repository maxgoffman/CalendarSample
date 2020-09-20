import React from "react";
import moment from 'moment';
import styles from './MonthViewStyles.module.scss';
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { selectMonthCalendar } from "../../../redux/options/ActionCreators";

const weekdays = moment.weekdays();    
//Create the header list using moment js
const weekdaysList = weekdays.map(day => {
    return (
        <div key={day} className={styles["day-header"]}>
            <span>{day}</span>
        </div>
    );
});

/** 
  * @desc MonthDaysList
  * Creates a grid header with the week days 
  * @author Maximiliano Goffman
  * @required Moment.js
*/
const MonthViewHeader = () => {
    const storageProps = useSelector(state => ({
        monthCalendar:state.options.monthCalendarSelected
    }), shallowEqual);

    const dateHelper = storageProps.monthCalendar ? moment(storageProps.monthCalendar) : moment().startOf("month");

    const dispatch = useDispatch();
    const prevMonth = () => {
        dispatch(selectMonthCalendar(dateHelper.subtract(1,'month').startOf("month")));
    }

    const nextMonth = () => {
        dispatch(selectMonthCalendar(dateHelper.add(1,'month').startOf("month")));
    }

    return (
        <React.Fragment>
            <div className={styles["month-calendar-header"]}>
                <div className={styles["month-calendar-header-column"]}>
                    <div className={styles["month-header"]} style={{justifyContent: 'flex-start'}}>
                        <button type="button" onClick={prevMonth} className={styles["header-button"]}>{'<<'}</button>
                    </div>
                </div>
                <div className={styles["month-calendar-header-column"]}>
                    <span>{dateHelper.format("MMMM YYYY")}</span>
                </div>
                <div className={styles["month-calendar-header-column"]} >
                    <div className={styles["month-header"]} style={{justifyContent: 'flex-end'}}>
                        <button type="button" onClick={nextMonth} className={styles["header-button"]}>{'>>'}</button>
                    </div>
                </div>
            </div>
            <div className={styles["month-header"]}>
                {weekdaysList}
            </div>
        </React.Fragment>
      );
}

export default MonthViewHeader;
import React from "react";
import moment from 'moment';
import MonthCellContent from "./MonthCellContentComponent";
import styles from './MonthViewStyles.module.scss';
import { useSelector, shallowEqual } from "react-redux";

/* 
I'll use a layer approach to show the Month View.
These are some data structures to work with them
*/
const BG_LAYER = 0;
const CONTENT_LAYER = 1;
const REMINDERS_LAYER = 2;
const TOTAL_LAYERS = 3;

//Helper Function to get the correct classes depending on the cell
const getCellClassName = (layerIndex, columnIndex, empty) => {
    let returnValue = '';
    switch (layerIndex) {
        case BG_LAYER:
            returnValue = `${styles['day-bg']}${(columnIndex % 6 === 0 ? ` ${styles['weekend-day']}` : '')}`;
            break;
        case CONTENT_LAYER:
            returnValue = `${styles['date-cell']}${(empty ? ` ${styles['row-empty']}` : (columnIndex % 6 === 0 ? ` ${styles['weekend-day']}` : ''))}`;
            break;
        default: break;
    }
    returnValue += empty ? '' : ` ${styles['active-cell']}`;
    return returnValue;
}

//Helper function to fill the Cell content depending on layer and position
const cellsFill = (daysList, indexTo, daysFrom, keyFrom, empty, dateHelper) => {
    for (let i = 0; i < indexTo; i++) {
        
        for (const [index, layer] of daysList.layers.entries()) {
            let row = layer[layer.length - 1];
            
            if (row.length >= 7) {
                row = [];
                layer.push(row);
                daysList.rowsLength = layer.length;
            }
            const cellDate = empty ? null : moment(dateHelper)
            .startOf("month")
            .add(i, "days");
            const classes = getCellClassName(index, row.length, empty);
            const content = (index === CONTENT_LAYER ? (daysFrom + i) : '');
            if (index !== REMINDERS_LAYER) {
                row.push(<MonthCellContent key={(i + keyFrom)} cellDate={cellDate} classes={classes} content={content} />);
            }
            else {
                row.push({day:cellDate, empty:empty});
            }
        }
    }
}

//helper functions used for reminder placement
const findMinDateInRow = (row) => {
    let i = 0;
    while (i < row.length) {
        if (row[i].day) return {day:row[i].day,index:i};
        i++;
    }
    return null;
}

const findMaxDateInRow = (row) => {
    let i = row.length - 1;
    while (i > 0) {
        if (row[i].day) return {day:row[i].day, index:i};
        i--;
    }
    return null;
}

//adds a blank space before the first reminder of the row
const getInitialSegment = (index) => {
    const position = `${(index/7)*100}%`;
    const style= { 
        flexBasis: position,
        maxWidth: position
    };
    return (<div key={0} className={styles["row-segment"]} style={style}></div>);
}

//helper function to add a reminder to the calendar
const getRegularSegment = (key, reminder) => {
    const length = `${(1/7)*100}%`;
    const style= { 
        flexBasis: length,
        maxWidth: length,
        borderColor: (reminder.color.hex ? reminder.color.hex : reminder.color),
        background: (reminder.color.hex ? reminder.color.hex : reminder.color)
    };
    return (
    <div key={key} className={styles["row-segment"]} style={style}>
        <div className={styles["month-event"]}>
            <div className={styles["month-event-title"]}>
                {reminder.title}
            </div>
        </div>
    </div>);
}


/** 
  * @desc MonthDaysList
  * Creates a grid with the days of the month
  * @author Maximiliano Goffman
  * @required Moment.js redux
*/
const MonthDaysList = () => {
    //get reminder from redux store
    const storageProps = useSelector(state => ({
        reminders:state.reminders.reminders,
        monthCalendar:state.options.monthCalendarSelected
    }), shallowEqual);
    
    const dateHelper = storageProps.monthCalendar ? moment(storageProps.monthCalendar) : moment().startOf("month");

    const daysList = {
        rowsLength: 0,
        layers:[]
    };
    for (let i = 0; i < TOTAL_LAYERS; i++) {
        daysList.layers.push([[]]);    
    }
    
    //Date constants I'm going to use in the Month View
    const firstDay = moment(dateHelper)
                        .startOf("month")
                        .format("d"); 
    const daysBefore = parseInt(moment(dateHelper)
                        .startOf("month")
                        .subtract(firstDay, "days")
                        .format("D"));
    
    if (daysBefore > 0) {
        //fill the first batch with the previous month days
        cellsFill(daysList, firstDay, daysBefore, 0, true, dateHelper);
    }
    
    //fill month cells
    cellsFill(daysList, dateHelper.daysInMonth(), 1, daysBefore, false, dateHelper);

    if (daysList.layers[0][daysList.layers[0].length - 1].length < 7) {
        //fill the remaining batch of cells with the following month days
        cellsFill(daysList, 7 - daysList.layers[0][daysList.layers[0].length - 1].length, 1, daysBefore + dateHelper.daysInMonth(), true, dateHelper);    
    }
    
    //save the reminders in an adequate data structure
    for (const [index, row] of daysList.layers[REMINDERS_LAYER].entries()) {
        const minDate = findMinDateInRow(row);
        const maxDate = findMaxDateInRow(row);
        const remindersFiltered = storageProps.reminders.filter(item => {return moment(item.day).isBetween(minDate.day, maxDate.day, 'day', '[]')});
        if (remindersFiltered.length > 0) {
            let currentDate = moment(minDate.day);
            const subRows = [];
            let columnIndex = minDate.index;
            let lastColumnIndex = [];
            while (!currentDate.isAfter(maxDate.day)) {
                const dayReminders = remindersFiltered.filter(item => {return moment(item.day).isSame(currentDate, 'day')});
                for (const [index, reminder] of dayReminders.entries()) {
                    if (index >= subRows.length) {
                        subRows.push([getInitialSegment(columnIndex)]);
                        lastColumnIndex.push(columnIndex);
                    }
                    if (columnIndex > lastColumnIndex[index] + 1)
                    {
                        subRows[index].push(getInitialSegment(columnIndex - lastColumnIndex[index] - 1));
                    }
                    subRows[index].push(getRegularSegment(subRows[index].length, reminder));
                    lastColumnIndex[index] = columnIndex;
                }
                currentDate.add(1, 'day');
                columnIndex++;
            }
            daysList.layers[REMINDERS_LAYER][index] = subRows.map((item,index) => {
                return (
                <div key={index} className={styles["row-fg"]}>
                    {item}
                </div>
                );  
            });
        }
        else {
            daysList.layers[REMINDERS_LAYER][index] = [];
        }
    }
    
    
    //Wrap rows inside layers
    for (let [index, layer] of daysList.layers.entries()) {
        let base = (index === 0 ? 0 : daysList.layers[index - 1].length * index);
        switch (index) {
            case BG_LAYER:
                daysList.layers[index] = layer.map((row, columnIndex) => {
                    return <div key={base + columnIndex} className={styles["row-bg"]}>{row}</div>;
                    });
                break;
            case CONTENT_LAYER:
                daysList.layers[index] = layer.map((row, columnIndex) => {
                    
                    return (
                    <div key={base + columnIndex} className={styles["row-content"]} style={{pointerEvents:'none'}}>
                        <div className={styles["row-fg"]} style={{pointerEvents:'auto'}}>{row}</div>
                        <div className={styles["month-event-layer"]}>{daysList.layers[REMINDERS_LAYER][columnIndex]}</div>
                    </div>);
                    });
                break;
            default: break;
        }
    }

    //interleave layer rows and wrap them with the month row class
    const wrappedMonthRows = [];
    for (let i = 0; i < daysList.rowsLength; i++) {
        let content =[];
        for (let [index, layer] of daysList.layers.entries()) {
            if (index !== REMINDERS_LAYER)
                content.push(layer[i]);
        }
         
        wrappedMonthRows.push(
        <div key={i} className={styles["month-row"]}>
            {content}
        </div>);
    }
    return (<React.Fragment>{wrappedMonthRows}</React.Fragment>);
}

export default MonthDaysList;
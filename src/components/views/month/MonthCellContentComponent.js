import React from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import {selectDay} from '../../../redux/options/ActionCreators';
import {localBaseRoute} from '../../Calendar';


/** 
  * @desc MonthCellContent
  * Creates a cell for the month grid
  * @author Maximiliano Goffman
*/
const MonthCellContent = (props) => {
    const dispatch = useDispatch();
    const selectDayCell = () => {
      if (!props.cellDate)
        return;
      dispatch(selectDay(props.cellDate));
      props.history.push(localBaseRoute + 'time/');
    };
    
    return (<div className={props.classes} onClick={selectDayCell}>{props.content ? props.content : ''}</div>);
}

export default withRouter(MonthCellContent);
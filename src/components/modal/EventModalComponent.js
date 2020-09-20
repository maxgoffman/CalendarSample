import React, { useState, useEffect } from "react";
import { CompactPicker } from 'react-color';
import Modal from "./ModalComponent";
import WeatherForecast from "./WeatherForecastComponent";
import styles from './ModalComponent.module.scss';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { unselectTime, unselectReminder } from "../../redux/options/ActionCreators";
import { addReminder, updateReminder, deleteReminder } from "../../redux/reminders/ActionCreators";
import { fetchWeather, unsetWeather } from "../../redux/weather/ActionCreators";
  
/** 
  * @desc WeatherForecast
  * Shows weather forecast
  * @author Maximiliano Goffman
  * @required redux Moment.js
*/  
const EventModal = (props) => {
  //get options from redux
  const storageProps = useSelector(state => ({
    dateSelected:state.options.dateSelected, 
    timeSelected:state.options.timeSelected, 
    reminderSelected:state.options.reminderSelected,
    reminders:state.reminders.reminders
  }), shallowEqual);
  const dispatch = useDispatch();
  const [color, updateColor] = useState(storageProps.reminderSelected ? storageProps.reminderSelected.color : '#000000');
  const [title, updateTitle] = useState(storageProps.reminderSelected ? storageProps.reminderSelected.title : '');
  const [titleError, updateTitleError] = useState('');
  const [dateError, updateDateError] = useState('');
  const [cityError, updateCityError] = useState('');
  const [city, updateCity] = useState(storageProps.reminderSelected ? storageProps.reminderSelected.city : '');
  const [day, updateDay] = useState(storageProps.dateSelected ? storageProps.dateSelected.format('YYYY-MM-DD'): '');
  const [stateHours, updateHours] = useState(false);
  const [stateMinutes, updateMinutes] = useState(false);
  const [allowUpdate, updateAllowUpdate] = useState(true);
  
  
  const dayHours = [];
  const minutesSelect = [];
  for (let i= 0; i < 24; i++) {
    dayHours.push(<option key={i} value={i}>{i}</option>);  
  }  
  for (let i = 0; i <= 59; i++) {
    minutesSelect.push(<option key={i} value={i}>{(i < 10 ? '0' + i : i)}</option>);  
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (allowUpdate) {
      let [hours, minutes] = storageProps.timeSelected ? storageProps.timeSelected.split(':') : (storageProps.reminderSelected ? storageProps.reminderSelected.time.split(':') : ['0', '0']);
      updateHours(hours);
      updateMinutes(minutes);
      updateColor(storageProps.reminderSelected ? storageProps.reminderSelected.color : '#000000');
      updateTitle(storageProps.reminderSelected ? storageProps.reminderSelected.title : '');
      updateCity(storageProps.reminderSelected ? storageProps.reminderSelected.city : '');
      if (storageProps.reminderSelected && storageProps.reminderSelected.city) {
        dispatch(fetchWeather(city));
      }
      updateDay(storageProps.dateSelected ? storageProps.dateSelected.format('YYYY-MM-DD'): '');
  
    }
  });
  
  
  const handleInputChange = (event) => {
    updateAllowUpdate(false);
    switch (event.target.name) {
      case 'title':
        updateTitleError('');
        updateTitle(event.target.value);
      break;
      case 'city':
        updateCityError('');
        updateCity(event.target.value);
      break;
      case 'day':
        updateDateError('');
        updateDay(event.target.value); 
      break;
      case 'hours':
        updateHours(event.target.value); 
      break;
      case 'minutes':
        updateMinutes(event.target.value); 
      break;
      default:
      break;
    }    
  }

  const handleColorChange = (colorPicked, event) => {
    updateAllowUpdate(false);
    updateColor(colorPicked);
  }
  

  const validateCity = () => {
    if (city.trim().length <= 0) {
      updateCityError(<div className={styles.error}>{"Can't Leave City Empty"}</div>);
      return false;
    }
    return true;
  }

  const validate = () => {
    if (title.trim().length <= 0) {
      updateTitleError(<div className={styles.error}>{"Can't Leave Title Empty"}</div>);
      return false;
    }
    if (!day) {
      updateDateError(<div className={styles.error}>{"Can't Leave Date Empty"}</div>);
      return false;
    }
    return validateCity();
  }

  
  
  //adds or updates reminders
  const saveReminder = () => {
    if (!validate()) {
      return;
    }
      
    if (!storageProps.reminderSelected) {
      let id = 1;
      if (storageProps.reminders.length > 0) {
        for (let item of storageProps.reminders) {
          if (item.id > id) {
            id = item.id;
          }
        }
        id++;
      }
      dispatch(addReminder({
        id: id,
        color: color,
        city: city,
        time:`${stateHours}:${stateMinutes}`,
        day: day,
        title: title
      }));
    }
    else {
      dispatch(updateReminder({
        id: storageProps.reminderSelected.id,
        color: color,
        city: city,
        time:`${stateHours}:${stateMinutes}`,
        day: day,
        title: title
      }));
    }
    
    closeModal();
  }
  const deleteReminderCall = () => {
    
    dispatch(deleteReminder({
      id: storageProps.reminderSelected.id,
      }));
    closeModal();
  }

  const closeModal = () => {
    dispatch(unselectTime());
    dispatch(unselectReminder());
    dispatch(unsetWeather());
    updateHours(false);
    updateMinutes(false);
    updateCity(''); 
    updateAllowUpdate(true);
    updateTitleError("");
    updateCityError("");
    updateDateError("");
    props.showHideModal();
  }
  const handleKeyDown = (event) =>  {
    if (event.key === 'Enter') {
        dispatch(fetchWeather(city));
    }
  }
  const handleBlur = (event) => {
    if (validateCity())
      dispatch(fetchWeather(city));
  }

  const deleteButton = (storageProps.reminderSelected ? <div className={styles['modal-column']}><button className={`${styles['delete-button']}`} onClick={deleteReminderCall}>Delete</button></div> : <React.Fragment></React.Fragment>);

  return (
    <Modal isOpen={props.isModalOpen} handleClose={closeModal}>
          <div className={styles['modal-column']}>
            <div className={`${styles["modal-row"]} ${styles.center}`}>
              <h2>Edit Reminder</h2>
            </div>
            <div className={styles["modal-row"]}><h4>Title</h4></div>
            <input type="text" name="title" value={title} maxLength="30" onChange={handleInputChange} />{titleError}
            <div className={styles["modal-row"]}><h4>City</h4></div>
            <input type="text" name="city" value={city} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleInputChange} /><br/>{cityError}<br /><WeatherForecast />
            <div className={styles["modal-row"]}>
              <div className={styles['modal-column']}>
                <div className={styles["modal-row"]}><h4>Day</h4></div>
                <div className={styles["modal-row"]}><input type="date" name="day" value={day} onChange={handleInputChange} /></div>
                {dateError}
              </div>
              <div className={styles['modal-column']}>
                <div className={styles["modal-row"]}><h4>Time</h4></div>
                <div className={styles["modal-row"]}>
                  <select name="hours" onChange={handleInputChange} value={stateHours}>{dayHours}</select> : <select name="minutes" value={stateMinutes} onChange={handleInputChange}>{minutesSelect}</select>
                </div>
              </div>
            </div> 
            <div className={styles["modal-row"]}><hr/></div>
            <div className={styles["modal-row"]}>
              <h4>Color:&nbsp;&nbsp;&nbsp;&nbsp;</h4>
              <CompactPicker color={color} onChange={ handleColorChange } />
            </div>
            <hr/>
            <div className={styles['modal-row']}>
              <div className={styles['modal-column']}>
                <button className={`${styles['button-save']}`} onClick={saveReminder}>Save</button>
              </div>
              {deleteButton}
            </div>
          </div>
    </Modal>
  );
};

export default EventModal;
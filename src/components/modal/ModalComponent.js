import React from "react";
import styles from './ModalComponent.module.scss';

/** 
  * @desc Modal
  * Since i'm not using any big library like bootstrap or material
  * i'm creating a simple modal manually
  * @author Maximiliano Goffman
*/
const Modal = ({ handleClose, isOpen, children }) => {
    
    const showHideClassName = (isOpen ? `${styles.modal} ${styles['display-block']}` : `${styles.modal} ${styles['display-none']}`);
  
    return (
      <div className={showHideClassName}>
        <section className={`${styles['modal-main']}`}>
          <div className={`${styles["modal-row"]} ${styles.right}`}>
            <button className={`${styles['close-button']}`} onClick={handleClose}>X</button>
          </div>
          {children}
        </section>
      </div>
    );
};

export default Modal;
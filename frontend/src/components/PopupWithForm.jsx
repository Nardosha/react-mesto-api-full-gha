import React from 'react';
import { popupOptions } from '../utils/constants';
import { usePopupClose } from '../hooks/usePopupClose';

export const PopupWithForm = (props) => {
  const { name, title, submitButtonText, isOpen, onClose, onSubmit } = props;

  usePopupClose(isOpen, onClose);

  return (
    <dialog
      className={`popup popup_type_${name} ${isOpen ? popupOptions.openedPopupClass : ''}`}
      open={isOpen}
    >
      <div className="popup__container">
        <button
          className="icon-button popup__button-close"
          type="button"
          data-action="CLOSE"
          aria-label="Закрыть"
          onClick={onClose}
        />

        <h2 className="popup__title">{title}</h2>

        <form className="popup__form form" action="#" name={name} id={name} onSubmit={onSubmit}>
          {props.children}

          <button
            className="form__button-submit form__button-submit_color_black"
            type="submit"
            id="form_button_submit"
            data-action="SUBMIT"
          >
            {submitButtonText}
          </button>
        </form>
      </div>
    </dialog>
  );
};

import React, { useContext } from 'react';
import { popupOptions } from '../utils/constants';
import { usePopupClose } from '../hooks/usePopupClose';
import { AppContext } from '../contexts/AppContext';

export const InfoTooltip = ({ type, text, isOpen }) => {
  const { closeAllPopups } = useContext(AppContext);

  usePopupClose(isOpen, closeAllPopups);

  return (
    <dialog className={`popup popup_type_info ${isOpen ? popupOptions.openedPopupClass : ''}`}>
      <div className="popup__container">
        <button
          className="icon-button popup__button-close"
          type="button"
          data-action="CLOSE"
          aria-label="Закрыть"
          onClick={closeAllPopups}
        />

        <p className={`popup__info popup__info_type_${type}`}>{text}</p>
      </div>
    </dialog>
  );
};

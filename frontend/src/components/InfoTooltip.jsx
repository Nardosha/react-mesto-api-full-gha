import React, { useCallback, useContext } from 'react';
import { popupOptions } from '../utils/constants';
import { usePopupClose } from '../hooks/usePopupClose';
import { AppContext } from '../contexts/AppContext';

export const InfoTooltip = ({ type, isOpen }) => {
  const { closeAllPopups } = useContext(AppContext);

  usePopupClose(isOpen, closeAllPopups);

  const infoText = useCallback(() => {
    return type === 'error'
      ? 'Что-то пошло не так! Попробуйте ещё раз.'
      : 'Вы успешно зарегистрировались!';
  }, [type]);

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

        <p className={`popup__info popup__info_type_${type}`}>{infoText()}</p>
      </div>
    </dialog>
  );
};

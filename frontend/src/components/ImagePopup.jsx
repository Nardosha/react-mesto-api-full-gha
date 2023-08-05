import { popupOptions } from '../utils/constants';
import { usePopupClose } from '../hooks/usePopupClose';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const ImagePopup = ({ card }) => {
  const { closeAllPopups } = useContext(AppContext);

  usePopupClose(!!card?.link, closeAllPopups);

  return (
    <dialog
      className={`popup popup-show-photo ${card?.link ? popupOptions.openedPopupClass : ''}`}
      data-popup-type="SHOW"
      open={card}
    >
      <div className="popup-show-photo__container">
        <button
          className="icon-button popup__button-close"
          type="button"
          data-action="CLOSE"
          aria-label="Закрыть"
          onClick={closeAllPopups}
        />

        <img className="popup-show-photo__photo" src={card?.link} alt={card?.name} />
        <h2 className="popup-show-photo__description">{card?.name}</h2>
      </div>
    </dialog>
  );
};

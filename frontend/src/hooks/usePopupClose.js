import { useEffect } from 'react';
import { popupOptions } from '../utils/constants';

export const usePopupClose = (isOpen, closeAllPopups) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleOverlayClick = (evt) => {
      if (evt.target.classList.contains(popupOptions.openedPopupClass)) {
        closeAllPopups();
      }
    };
    const handleEscapeDown = (evt) => {
      if (evt.code !== 'Escape') return;
      closeAllPopups();
    };

    document.addEventListener('mousedown', handleOverlayClick);
    document.addEventListener('keydown', handleEscapeDown);

    return () => {
      document.removeEventListener('mousedown', handleOverlayClick);
      document.removeEventListener('keydown', handleEscapeDown);
    };
  }, [isOpen, closeAllPopups]);
};

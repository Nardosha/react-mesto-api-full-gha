import { PopupWithForm } from './PopupWithForm';
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';

export const EditAvatarPopup = ({ isOpen, onUpdateAvatar }) => {
  const { isLoading, closeAllPopups } = useContext(AppContext);

  const avatarLinkRef = useRef();

  const _handleSubmit = (e) => {
    e.preventDefault();

    onUpdateAvatar({ avatar: avatarLinkRef.current.value });
  };

  useEffect(() => {
    if (!isOpen) {
      avatarLinkRef.current.value = '';
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      name="update-avatar"
      title="Обновить аватар"
      submitButtonText={isLoading ? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={closeAllPopups}
      onSubmit={_handleSubmit}
    >
      <fieldset className="form__inputs" form="form_avatar">
        <label className="form__label" htmlFor="input_avatar_src">
          <input
            ref={avatarLinkRef}
            className="form__input form__input_field_avatar-src"
            id="input_avatar_src"
            name="avatar"
            type="url"
            placeholder="Ссылка на картинку"
            required
          />

          <span className="form__input-error" id="input_avatar_src-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
};

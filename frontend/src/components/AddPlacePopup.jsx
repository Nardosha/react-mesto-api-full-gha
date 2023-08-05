import { PopupWithForm } from './PopupWithForm';
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';

export const AddPlacePopup = ({ isOpen, onAddPlace }) => {
  const { isLoading, closeAllPopups } = useContext(AppContext);

  const placeNameRef = useRef();
  const placeLinkRef = useRef();

  const _handleAddPlace = (e) => {
    e.preventDefault();

    onAddPlace({
      name: placeNameRef.current.value,
      link: placeLinkRef.current.value,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      placeNameRef.current.value = '';
      placeLinkRef.current.value = '';
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      name="add-photo"
      title="Новое место"
      submitButtonText={isLoading ? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={closeAllPopups}
      onSubmit={_handleAddPlace}
    >
      <fieldset className="form__inputs" form="form_image">
        <label className="form__label" htmlFor="input_image_description">
          <input
            ref={placeNameRef}
            className="form__input form__input_field_image-description"
            id="input_image_description"
            data-user-field="name"
            name="name"
            type="text"
            placeholder="Название"
            minLength="2"
            maxLength="30"
            required
          />
          <span className="form__input-error" id="input_image_description-error"></span>
        </label>

        <label className="form__label" htmlFor="input_image_src">
          <input
            ref={placeLinkRef}
            className="form__input form__input_field_image-src"
            id="input_image_src"
            data-user-field="link"
            name="link"
            type="url"
            placeholder="Ссылка на картинку"
            required
          />

          <span className="form__input-error" id="input_image_src-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
};

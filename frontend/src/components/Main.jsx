import React, { useContext } from 'react';
import { Card } from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export const Main = React.memo(
  ({ cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete }) => {
    const currentUser = useContext(CurrentUserContext);

    return (
      <main className="page">
        <section className="profile">
          <div className="profile__info-container">
            <button className="profile__avatar-button" type="button" onClick={onEditAvatar}>
              <img className="profile__avatar" src={currentUser.avatar} alt="Аватар" />
            </button>
            <div className="profile__settings">
              <h1 className="profile__full-name" data-user-field="userFullName">
                {currentUser.name}
              </h1>
              <p className="profile__about" data-user-field="userDescription">
                {currentUser.about}
              </p>
              <button
                className="icon-button profile__edit-button"
                data-action="OPEN"
                data-action-type="EDIT"
                type="button"
                aria-label="Редактировать"
                onClick={onEditProfile}
              />
            </div>
          </div>
          <button
            className="icon-button profile__add-button"
            type="button"
            aria-label="Загрузить"
            data-action="OPEN"
            data-action-type="ADD"
            onClick={onAddPlace}
          />
        </section>

        <section className="content-photos">
          <ul className="content-photos__list">

              {!cards.length ? 'Добавьте карточки :)' : cards.map((card) => (
              <Card
                card={card}
                key={card._id}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            ))}
          </ul>
        </section>
      </main>
    );
  },
);

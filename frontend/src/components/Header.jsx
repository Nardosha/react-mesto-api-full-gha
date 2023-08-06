import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import logo from '../images/logo.svg';

export const Header = ({ isLoggedIn, handleSignOut, userEmail }) => {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Mesto" />

      <div className="header__user-email">{userEmail}</div>
      {!isLoggedIn && (
        <Routes>
          <Route
            path={'/signup'}
            element={
              <Link to={'/signin'} className="link header__link">
                Войти
              </Link>
            }
          />
          <Route
            path={'/signin'}
            element={
              <Link to={'/signup'} className="link header__link">
                Регистрация
              </Link>
            }
          />
        </Routes>
      )}

      {isLoggedIn && (
        <Link to="/signin" className="link header__link" onClick={handleSignOut}>
          Выйти
        </Link>
      )}
      <div></div>
    </header>
  );
};

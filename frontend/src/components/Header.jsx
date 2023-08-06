import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.svg';

export const Header = React.memo(({ isLoggedIn, handleSignOut, userEmail }) => {
  const location = useLocation();

  const setLocation = () => {
    return !!(location.pathname === '/signin' || location.pathname === '/');
  };

  const isLogging = useRef(setLocation());

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Mesto" />

      <div className="header__user-email">{userEmail}</div>
      {isLogging && !isLoggedIn && (
        <Link to="/signup" className="link header__link">
          Зарегестрироваться
        </Link>
      )}

      {!isLogging && !isLoggedIn && (
        <Link to="/signin" className="link header__link">
          Войти
        </Link>
      )}

      {isLoggedIn && (
        <Link to="/signin" className="link header__link" onClick={handleSignOut}>
          Выйти
        </Link>
      )}
      <div></div>
    </header>
  );
});

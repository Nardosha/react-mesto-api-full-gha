import React, { useContext, useEffect, useState } from 'react';
import logo from '../images/logo.svg';
import { AppContext } from '../contexts/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const context = useContext(AppContext);
  const location = useLocation();

  const setLocation = () => {
    return !!(location.pathname === '/sign-in' || location.pathname === '/');
  };

  const [isLogging, setIsLogging] = useState(setLocation);

  useEffect(() => {
    setIsLogging(setLocation);
  });

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Mesto" />
      {isLogging && !context.isLoggedIn && (
        <Link to="/sign-up" className="link header__link">
          Зарегестрироваться
        </Link>
      )}

      {!isLogging && !context.isLoggedIn && (
        <Link to="/sign-in" className="link header__link">
          Войти
        </Link>
      )}

      {context.isLoggedIn && (
        <Link to="/sign-in" className="link header__link" onClick={context.handleSignOut}>
          Выйти
        </Link>
      )}
    </header>
  );
};

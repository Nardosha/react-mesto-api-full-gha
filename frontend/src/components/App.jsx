import React, { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from './Main';
import { PopupWithForm } from './PopupWithForm';
import { ImagePopup } from './ImagePopup';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { AppContext } from '../contexts/AppContext';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Register } from './Register';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from './Login';
import { InfoTooltip } from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    avatar: '',
    _id: null,
  });
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cards, setCards] = useState([]);

  const tooltip = useRef({ type: 'success', text: 'Вы успешно зарегистрировались!' });
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const _handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const _handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const _handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setIsInfoPopupOpen(false);
    setSelectedCard(null);
  };

  const _handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleRequest = async (request) => {
    setIsLoading(true);
    try {
      await request();
      closeAllPopups();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const _handleUpdateUser = async ({ name, about }) => {
    const submitEditUserProfile = async () => {
      const { data: user } = await api.editUserInfo({ name, about });
      await setCurrentUser({ ...currentUser, name: user.name, about: user.about });
    };

    await handleRequest(submitEditUserProfile);
  };

  const _handleUpdateAvatar = async ({ avatar }) => {
    const submitEditUserAvatar = async () => {
      const { data: user } = await api.editUserAvatar({ avatar });

      setCurrentUser({ ...currentUser, avatar: user.avatar });
    };

    await handleRequest(submitEditUserAvatar);
  };

  const _handleAddPlaceSubmit = async (card) => {
    const submitAddPlace = async () => {
      const { data: newCard } = await api.createCard(card);
      setCards([newCard, ...cards]);
    };

    await handleRequest(submitAddPlace);
  };

  const _handleCardLike = async (card) => {
    try {
      const isLiked = card.likes.find((user) => user._id === currentUser._id);
      const { data: newCard } = await api.changeLikeCardStatus(card._id, !isLiked);

      setCards((state) => state.map((card) => (card._id === newCard._id ? newCard : card)));
    } catch (err) {
      console.log(err);
    }
  };

  const _handleDeleteCard = async (deletedCard) => {
    try {
      await api.deleteCard(deletedCard._id);
      setCards((state) => state.filter((card) => card._id !== deletedCard._id));
    } catch (err) {
      console.log(err);
    }
  };

  const loadData = async () => {
    try {
      const { data: user } = await api.loadUserInfo();
      const { data: cards } = await api.getInitialCards();

      if (user) {
        setCurrentUser({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
        setCards([...cards]);
      }
    } catch (e) {
      console.log('Юзер или карточки не загрузились', e);
      showPopup('error', 'Что-то пошло не так! Попробуйте ещё раз.');
      setIsLoggedIn(false);
      setUserEmail('');
    }
  };

  const handleRegister = async (formData) => {
    try {
      const res = await auth.register(formData.email, formData.password);
      if (!res?.data) {
        return;
      }

      showPopup('success', 'Регистрация прошла успешно!');
      navigate('/signin', { replace: true });
    } catch (err) {
      setIsLoggedIn(false);

      if (err.status === 409) {
        showPopup('error', 'Такой пользователь уже существует.');
        return;
      }

      showPopup('error', 'Что-то пошло не так! Попробуйте ещё раз.');
    }
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const { data: user } = await auth.login(formData.email, formData.password);

      if (user?.token) {
        navigate('/', { replace: true });
        setIsLoggedIn(true);
        setCurrentUser({
          ...currentUser,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
        setUserEmail(user.email);
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUserEmail('');
      showPopup('error', 'Что-то пошло не так! Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthToken = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await auth.checkToken();

      if (user) {
        setIsLoggedIn(true);
        setCurrentUser({
          ...currentUser,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
        setUserEmail(user.email);
        navigate('/', { replace: true });
        return user;
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
      setUserEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.logout();
      setIsLoggedIn(false);
      setCurrentUser({ name: '', about: '', avatar: '', _id: null });
      setUserEmail('');
      navigate('/signin', { replace: true });
    } catch (err) {
      console.error(err);
      showPopup('error', 'Что-то пошло не так! Попробуйте ещё раз.');
    }
  };

  useEffect(() => {
    checkAuthToken();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    loadData();
  }, [isLoggedIn]);

  const showPopup = (type, text, isOpen = true) => {

    tooltip.current = { type, text };
    setIsInfoPopupOpen(isOpen);
  };

  return (
    <div className="root">
      <AppContext.Provider
        value={{
          isLoggedIn,
          isLoading,
          handleLogin,
          handleRegister,
          handleSignOut,
          closeAllPopups,
        }}
      >
        <CurrentUserContext.Provider value={currentUser}>
          <div className="wrapper">
            <Header isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} userEmail={userEmail} />

            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? <Navigate to="/me" replace /> : <Navigate to="/signin" replace />
                }
              />

              <Route path="/signup" element={<Register />} />
              <Route path="/signin" element={<Login />} />

              <Route
                path="/me"
                element={
                  <ProtectedRoute
                    element={Main}
                    cards={cards}
                    onEditProfile={_handleEditProfileClick}
                    onAddPlace={_handleAddPlaceClick}
                    onEditAvatar={_handleEditAvatarClick}
                    onCardClick={_handleCardClick}
                    onCardLike={_handleCardLike}
                    onCardDelete={_handleDeleteCard}
                  />
                }
              />
            </Routes>

            {isLoggedIn && <Footer />}
          </div>

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onUpdateUser={_handleUpdateUser} />

          <AddPlacePopup isOpen={isAddPlacePopupOpen} onAddPlace={_handleAddPlaceSubmit} />

          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onUpdateAvatar={_handleUpdateAvatar} />

          <PopupWithForm name="confirm" title="Вы уверены?" isOpen={isConfirmPopupOpen} />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip
            type={tooltip.current.type}
            text={tooltip.current.text}
            isOpen={isInfoPopupOpen}
          />
        </CurrentUserContext.Provider>
      </AppContext.Provider>
    </div>
  );
}

export default App;

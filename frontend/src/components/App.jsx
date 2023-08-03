import React, { useEffect, useState } from 'react';
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
  const [authUser, setAuthUser] = useState({
    email: '',
    password: '',
  });

  const [currentUser, setCurrentUser] = useState({
    name: '',
    description: '',
    avatar: '',
    _id: null,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
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

  const handleRequest = (request) => {
    setIsLoading(true);

    request()
      .then(closeAllPopups)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const _handleUpdateUser = ({ name, description }) => {
    const submitEditUserProfile = () => {
      return api.editUserInfo({ name, about: description }).then((res) => {
        setCurrentUser({
          ...currentUser,
          name: res.name,
          description: res.about,
        });
      });
    };

    handleRequest(submitEditUserProfile);
  };

  const _handleUpdateAvatar = ({ avatar }) => {
    const submitEditUserAvatar = () => {
      return api.editUserAvatar({ avatar }).then((user) => {
        setCurrentUser({ ...currentUser, avatar: user.avatar });
      });
    };

    handleRequest(submitEditUserAvatar);
  };

  const _handleAddPlaceSubmit = (card) => {
    const submitAddPlace = () => {
      return api.createCard(card).then((newCard) => {
        setCards([newCard, ...cards]);
      });
    };

    handleRequest(submitAddPlace);
  };

  const _handleCardLike = (card) => {
    const isLiked = card.likes.find((user) => user._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((card) => (card._id === newCard._id ? newCard : card)));
      })
      .catch(console.error);
  };

  const _handleDeleteCard = (deletedCard) => {
    api
      .deleteCard(deletedCard._id)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== deletedCard._id));
      })
      .catch(console.error);
  };

  const loadData = () => {
    Promise.all([api.loadUserInfo(), api.getInitialCards()])
      .then(([userInfo, cards]) => {
        setCurrentUser({
          name: userInfo.name,
          description: userInfo.about,
          avatar: userInfo.avatar,
          _id: userInfo._id,
        });
        setCards([...cards]);
      })
      .catch(console.error);
  };

  const handleRegister = (formData) => {
    if (!formData) {
      setIsInfoPopupOpen(true);
      return;
    }

    auth
      .register(formData.email, formData.password)
      .then((res) => {
        if (!res?.data) {
          return;
        }

        setIsLoggedIn(true);
        setIsInfoPopupOpen(true);
        setAuthUser({ email: formData.email, password: formData.password });
        navigate('/sign-in', { replace: true });
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsInfoPopupOpen(true);
      });
  };

  const handleLogin = (formData) => {
    if (!formData) return;

    auth
      .authorize(formData.email, formData.password)
      .then((res) => {
        if (res?.token) {
          localStorage.setItem('jwt', res.token);
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsInfoPopupOpen(true);
      });

    setIsLoggedIn(true);
    setAuthUser({ email: formData.email, password: formData.password });
    loadData();
  };

  const checkToken = () => {
    const token = localStorage.getItem('jwt');
    if (!token) return Promise.reject('Токен отсутствует');

    return auth
      .checkToken(token)
      .then((res) => {
        if (!res) return;

        setIsLoggedIn(true);
        navigate('/me', { replace: true });
      })
      .catch(console.error);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAuthUser({ email: '', password: '' });
    setCurrentUser({ name: '', description: '', avatar: '', _id: null });

    localStorage.removeItem('jwt');

    navigate('/', { replace: true });
  };

  useEffect(() => {
    checkToken()
      .then(() => {
        loadData();
      })
      .catch(console.error);

    return () => {
      setIsLoggedIn(false);
    };
  }, []);

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
            <Header />

            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? <Navigate to="/me" replace /> : <Navigate to="/sign-in" replace />
                }
              />

              <Route path="/sign-up" element={<Register />} />
              <Route path="/sign-in" element={<Login />} />

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

          <InfoTooltip type={isLoggedIn ? 'success' : 'error'} isOpen={isInfoPopupOpen} />
        </CurrentUserContext.Provider>
      </AppContext.Provider>
    </div>
  );
}

export default App;

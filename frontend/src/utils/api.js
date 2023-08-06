import { BASE_URL } from './auth';

const apiConfig = {
  url: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

class Api {
  constructor(config) {
    this.url = `${config.url}`;
    this.headers = config.headers;
  }

  loadUserInfo() {
    return fetch(`${this.url}/users/me`, {
      method: 'GET',
      headers: this.headers,
      credentials: 'include',
    })
      .then(this._handleResult)
  }

  editUserInfo(userInfo) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify(userInfo),
    }).then(this._handleResult);
  }

  editUserAvatar(avatar) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify(avatar),
    }).then(this._handleResult);
  }

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      headers: this.headers,
      credentials: 'include',
    }).then(this._handleResult);
  }

  createCard(cardParams) {
    return fetch(`${this.url}/cards`, {
      method: 'POST',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify(cardParams),
    }).then(this._handleResult);
  }

  deleteCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'include',
    }).then(this._handleResult);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.likeCard(cardId);
    }
    return this.dislikeCard(cardId);
  }

  likeCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this.headers,
      credentials: 'include',
    }).then(this._handleResult);
  }

  dislikeCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'include',
    }).then(this._handleResult);
  }

  _handleResult(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Error: ${response?.message || response?.status}`);
  }
}

const api = new Api(apiConfig);

export { api };

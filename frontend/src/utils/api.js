const apiConfig = {
  url: 'https://mesto.nomoreparties.co/v1',
  cohort: 'cohort-64',
  headers: {
    authorization: 'bb9d3cad-fe83-4951-9df0-d4b1a4879bd4',
    'Content-Type': 'application/json',
  },
};

class Api {
  constructor(config) {
    this.url = `${config.url}/${config.cohort}`;
    this.headers = config.headers;
  }

  loadUserInfo() {
    return fetch(`${this.url}/users/me`, {
      headers: this.headers,
    }).then(this._handleResult);
  }

  editUserInfo(userInfo) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(userInfo),
    }).then(this._handleResult);
  }

  editUserAvatar(avatar) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(avatar),
    }).then(this._handleResult);
  }

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      headers: this.headers,
    }).then(this._handleResult);
  }

  createCard(cardParams) {
    return fetch(`${this.url}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(cardParams),
    }).then(this._handleResult);
  }

  deleteCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
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
    }).then(this._handleResult);
  }

  dislikeCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this.headers,
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

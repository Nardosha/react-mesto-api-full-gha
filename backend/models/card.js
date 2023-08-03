import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL';
import {
  INCORRECT_URL_ERR,
  REQUIRED_CARD_NAME_ERR,
  REQUIRED_LINK_ERR,
} from '../utils/ENUMS';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: [true, REQUIRED_CARD_NAME_ERR],
  },
  link: {
    type: String,
    required: [true, REQUIRED_LINK_ERR],
    validate: {
      validator: (url) => isURL(url),
      message: INCORRECT_URL_ERR,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model('card', cardSchema);

export default Card;

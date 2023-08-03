import * as mongoose from "mongoose";
import isEmail from 'validator/lib/isEmail.js';
import isURL from 'validator/lib/isURL.js';
import {
  INCORRECT_EMAIL_ERR,
  INCORRECT_URL_ERR, MAX_LENGTH,
  MIN_LENGTH,
  REQUIRED_EMAIL_ERR,
  REQUIRED_PASSWORD_ERR, WRONG_AUTH_ERROR
} from "../utils/ENUMS.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, MIN_LENGTH],
    maxLength: [30, MAX_LENGTH],
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minLength: [2, MIN_LENGTH],
    maxLength: [30, MAX_LENGTH],
    default: 'Исследователь'
  },
  avatar: {
     type: String,
     validate: {
        validator: url => isURL(url),
        message: INCORRECT_URL_ERR
      },
     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
    },
    email: {
      type: String,
      unique: true,
      required: [true, REQUIRED_EMAIL_ERR],
      validate: {
        validator: email => isEmail(email),
        message: INCORRECT_EMAIL_ERR
      }
    },
    password: {
      type: String,
      required: [true, REQUIRED_PASSWORD_ERR],
      select: false
    }
})

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({email}).select('+password')

    if (!user) {
      throw new UnauthorizedError(WRONG_AUTH_ERROR)
    }

    return user
  } catch (err) {
    throw err
  }
}

const User = mongoose.model('user', userSchema);

export {User, userSchema};
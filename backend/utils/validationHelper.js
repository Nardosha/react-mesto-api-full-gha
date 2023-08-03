import { celebrate, Joi } from 'celebrate';
import * as mongoose from 'mongoose';
import { INCORRECT_ID_ERROR } from './ENUMS';

const URL_PATTERN = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
});

export const validateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_PATTERN),
  }).unknown(true),
});

export const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((id, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return helpers.message(INCORRECT_ID_ERROR);
      }
      return id;
    }),
  }).unknown(true),
});

export const validateUserUrl = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_PATTERN),
  }),
});

export const validateCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_PATTERN),
    likes: Joi.array(),
    createdAt: Joi.date(),
  }).unknown(true),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((id, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return helpers.message(INCORRECT_ID_ERROR);
      }
      return id;
    }),
  }).unknown(true),
});

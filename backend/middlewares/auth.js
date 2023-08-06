import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import {UNAUTHORIZED_ERROR} from '../utils/ENUMS.js';
import {JWT_SECRET} from '../config.js';

const auth = (req, res, next) => {
  const {token} = req.cookies;

  let user;

  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_ERROR));
    return
  }

  req.user = user
  next()
};

export default auth;

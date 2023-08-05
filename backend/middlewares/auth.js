import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import { UNAUTHORIZED_ERROR } from '../utils/ENUMS.js';
import { JWT_SECRET } from '../config.js';

const auth = (req, res, next) => {
  try {
    const { token } = req.cookies.jwt;

    req.user = jwt.verify(token, JWT_SECRET);

    next();
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_ERROR));
  }
};

export default auth;

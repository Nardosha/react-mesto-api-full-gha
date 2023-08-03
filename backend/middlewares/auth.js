import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError';
import { UNAUTHORIZED_ERROR } from '../utils/ENUMS';

const { SECURE_JWT_KEY } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedError(UNAUTHORIZED_ERROR);
    }

    const jwtToken = extractBearerToken(authorization);

    req.user = jwt.verify(jwtToken, SECURE_JWT_KEY);
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;

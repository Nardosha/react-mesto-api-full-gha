import { DEFAULT_ERROR_CODE, INTERNAL_SERVER_ERROR } from '../utils/ENUMS';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || DEFAULT_ERROR_CODE;
  const message = statusCode === DEFAULT_ERROR_CODE
    ? INTERNAL_SERVER_ERROR
    : err.message;

  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;

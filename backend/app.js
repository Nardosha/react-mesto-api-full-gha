import express from 'express';
import mongosse from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import usersRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { NOT_FOUND_PAGE_ERROR } from './utils/ENUMS';
import NotFoundError from './errors/NotFoundError';
import errorHandler from './middlewares/errorHandler';
import { validateLogin, validateUserData } from './utils/validationHelper';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import cors from './middlewares/CORS';

dotenv.config();

const { DEFAULT_PORT, DB_CONNECTION } = process.env;
const { PORT = DEFAULT_PORT } = process.env;

mongosse.connect(DB_CONNECTION);

const app = express();

app.use(cors);
app.use(bodyParser.json());
app.use(requestLogger);

app.use('/signup', validateLogin, validateUserData, createUser);
app.use('/signin', validateLogin, login);
app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardRoutes);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

import express from 'express';
import mongosse from 'mongoose';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import usersRoutes from "./routes/users.js";
import cardRoutes from "./routes/cards.js";
import {NOT_FOUND_PAGE_ERROR} from "./utils/ENUMS.js";
import {errors} from "celebrate";
import NotFoundError from "./errors/NotFoundError.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {validateLogin, validateUserData} from "./utils/validationHelper.js";
import {createUser, login} from "./controllers/users.js";
import {auth} from "./middlewares/auth.js";
import {errorLogger, requestLogger} from "./middlewares/logger.js";
import {cors} from "./middlewares/CORS.js";

dotenv.config();

const { DEFAULT_PORT, DB_CONNECTION } = process.env
const { PORT = DEFAULT_PORT } = process.env;

mongosse.connect(DB_CONNECTION)

const app = express();

app.use(cors)
app.use(bodyParser.json())
app.use(requestLogger)

app.use('/signup', validateLogin, validateUserData, createUser)
app.use('/signin', validateLogin, login)
app.use('/users', auth, usersRoutes)
app.use('/cards', auth, cardRoutes)

app.use(errorLogger)

app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR))
});

app.use(errors())

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})

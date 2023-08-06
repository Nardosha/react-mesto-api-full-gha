import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import {
  INTERSECTION_ERROR,
  NOT_FOUND_USER_ERROR,
  WRONG_AUTH_ERROR,
} from '../utils/ENUMS.js';
import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import IntersectionError from '../errors/IntersectionError.js';
import {JWT_SECRET} from '../config.js';

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    if (!user) {
      throw new UnauthorizedError(WRONG_AUTH_ERROR);
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: 3600000 * 24 * 7,
    });

    res.cookie('token', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });

    const loggedUser = {
      token,
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }

    res.send({data: loggedUser});
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name = undefined,
      about = undefined,
      avatar = undefined,
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: hash,
    });

    const newUser = {
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };

    res.send({data: newUser});
  } catch (err) {
    if (err.code === 11000) {
      next(new IntersectionError(INTERSECTION_ERROR));
      return;
    }

    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send({ data: users });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, { ...req.body }, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.send({ data: 'Пользователь разлогинен!' });
  } catch (err) {
    next(err);
  }
};

export {
  login,
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserInfo,
  signout,
};

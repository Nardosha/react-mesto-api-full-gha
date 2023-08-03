import {User} from "../models/user.js";
import {
  INTERSECTION_ERROR,
  NOT_FOUND_USER_ERROR,
  WRONG_AUTH_ERROR
} from "../utils/ENUMS.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import intersectionError from "../errors/IntersectionError.js";

const { SECURE_JWT_KEY } = process.env;

const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findUserByCredentials(email, password)

    if (!user) {
      throw new UnauthorizedError(WRONG_AUTH_ERROR)
    }

    const token = jwt.sign({_id: user._id}, SECURE_JWT_KEY, {
      expiresIn: 3600000 * 24 * 7
    })

    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true
    })

    res.send({
      token,
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    })
  } catch (err) {
    next(err)
  }
}

const createUser = async (req, res, next) => {
  try {
    const {
      name = undefined,
      about = undefined,
      avatar = undefined,
      email,
      password
    } = req.body;

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({name, about, avatar, email, password: hash});

    res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    })
  } catch (err) {
    if (err.code === 11000) {
      next(new intersectionError(INTERSECTION_ERROR))
      return
    }

    next(err)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send({data: users})
  } catch (err) {
    next(err)
  }
}

const getUser = async (req, res, next) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId)

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR)
    }

    res.send({data: user})
  } catch (err) {
    next(err)
  }
}

const getUserInfo = async (req, res, next) => {
  try {
    const {_id} = req.user
    const user = await User.findById(_id)

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }

    res.send({data: user})
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, {...req.body}, {
      new: true,
      runValidators: true,
      upsert: true
    });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR)
    }

    res.send({data: user});

  } catch (err) {
    next(err)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {avatar} = req.body;

    const user = await User.findByIdAndUpdate(userId, {avatar}, {
      new: true,
      runValidators: true,
      upsert: true
    });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR)
    }

    res.send({data: user});
  } catch (err) {
    next(err)
  }
}

export {
  login,
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserInfo
}
import express from "express"
import { getUser, getUsers, updateAvatar, updateUser, getUserInfo} from "../controllers/users.js";
import {auth} from "../middlewares/auth.js";
import {
  validateUserData,
  validateUserUrl,
  validateUserId
} from "../utils/validationHelper.js";

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getUserInfo)
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUserData, updateUser)
router.patch('/me/avatar', validateUserUrl, updateAvatar)

export default router;

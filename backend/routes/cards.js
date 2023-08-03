import express from "express"
import {createCard, deleteCard, dislikeCard, getCards, likeCard} from "../controllers/cards.js";
import {validateCardData, validateCardId} from "../utils/validationHelper.js";

const router = express.Router();

router.get('/', getCards);
router.post('/', validateCardData, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard)
router.delete('/:cardId/likes', validateCardId, dislikeCard)

export default router;

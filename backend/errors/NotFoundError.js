import { NOT_FOUND_ERROR_CODE } from '../utils/ENUMS.js';

export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}

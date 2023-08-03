import { FORBIDDEN_ERROR_CODE } from '../utils/ENUMS';

export default class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_CODE;
  }
}

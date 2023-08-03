import { INTERSECTION_ERROR_CODE } from '../utils/ENUMS.js';

export default class IntersectionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERSECTION_ERROR_CODE;
  }
}

import { INTERSECTION_ERROR_CODE } from '../utils/ENUMS';

export default class IntersectionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERSECTION_ERROR_CODE;
  }
}

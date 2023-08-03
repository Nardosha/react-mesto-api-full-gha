import {INTERSECTION_ERROR_CODE} from "../utils/ENUMS.js";

export default class intersectionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERSECTION_ERROR_CODE
  }
}
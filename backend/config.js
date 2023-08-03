import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 3001,
  SECURE_JWT_KEY_PROD,
  SECURE_JWT_KEY_DEV,
  DB_CONNECTION = 'mongodb://localhost:27017/mestodb',
} = process.env;

console.log(DB_CONNECTION, PORT, SECURE_JWT_KEY_PROD, SECURE_JWT_KEY_DEV);
const SECURE_JWT_KEY = process.env === 'production' ? SECURE_JWT_KEY_PROD : SECURE_JWT_KEY_DEV;

export default {
  PORT, DB_CONNECTION, SECURE_JWT_KEY,
};

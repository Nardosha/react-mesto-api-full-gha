import dotenv from 'dotenv';

dotenv.config();

export const {
  NODE_ENV,
  JWT_SECRET = 'shrek',
  PORT = 3000,
  DB_CONNECTION = "mongodb://localhost:27017/mestodb",
} = process.env;

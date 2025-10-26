import dotenv from 'dotenv';
import { ERROR_MESSAGES } from '../constants/http.constants.js';

dotenv.config();

const validateRequiredEnvVars = () => {
  if (!process.env.JWT_SECRET) {
    console.error(`❌ SECURITY ERROR: ${ERROR_MESSAGES.JWT_SECRET_MISSING}`);
    console.error('Please set JWT_SECRET in your .env file before starting the server.');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
};

validateRequiredEnvVars();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '24h',
  databaseUrl: process.env.DATABASE_URL,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  bcryptRounds: 10
};

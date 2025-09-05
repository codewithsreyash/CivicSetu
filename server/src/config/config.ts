import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number | string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string | number;
}

const config: AppConfig = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/civic-reporter',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export default config;
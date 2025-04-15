import dotenv from 'dotenv';

dotenv.config();

export const config = {
  airHost: process.env.AIR_HOST || 'localhost',
  apiToken: process.env.AIR_API_TOKEN || ''
};
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiHost: process.env.API_HOST || 'localhost',
  apiPort: process.env.API_PORT || '8000',
  apiToken: process.env.API_TOKEN || '',
};
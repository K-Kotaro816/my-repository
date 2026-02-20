import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.BACKEND_PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
} as const;

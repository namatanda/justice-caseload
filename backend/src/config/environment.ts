import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_DATABASE_URL: z.string().optional(),
  
  // Redis
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:9002'),
  
  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
  
  // API
  API_VERSION: z.string().default('v1'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  
  database: {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_DATABASE_URL,
  },
  
  redis: {
    url: env.REDIS_URL,
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
  },
  
  rateLimit: {
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  logging: {
    level: env.LOG_LEVEL,
  },
  
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
  },
  
  api: {
    version: env.API_VERSION,
  },
} as const;

export type Config = typeof config;
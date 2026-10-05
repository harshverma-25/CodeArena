import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z
    .string()
    .min(1, 'PORT environment variable is required')
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error('PORT must be a valid number');
      }
      return parsed;
    }),
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: 'NODE_ENV must be development, production, or test' }),
  }),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  GUEST_JWT_SECRET: z.string().default(process.env.GUEST_JWT_SECRET || 'codearena_secure_guest_jwt_secret_key_32_bytes_min'),
  JWT_ACCESS_SECRET: z.string().default(process.env.JWT_ACCESS_SECRET || process.env.GUEST_JWT_SECRET || 'codearena_secure_access_jwt_secret_key_32_bytes_min'),
  JWT_REFRESH_SECRET: z.string().default(process.env.JWT_REFRESH_SECRET || 'codearena_secure_refresh_jwt_secret_key_32_bytes_min'),
  JWT_ACCESS_EXPIRES_IN: z.string().default(process.env.JWT_ACCESS_EXPIRES_IN || '900'), // 15 mins (in seconds)
  JWT_REFRESH_EXPIRES_IN: z.string().default(process.env.JWT_REFRESH_EXPIRES_IN || '604800'), // 7 days (in seconds)
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
export default env;

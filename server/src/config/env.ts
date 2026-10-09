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
  GUEST_JWT_SECRET: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('900'), // 15 mins (in seconds)
  JWT_REFRESH_EXPIRES_IN: z.string().default('604800'), // 7 days (in seconds)
})
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      if (!data.GUEST_JWT_SECRET || data.GUEST_JWT_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['GUEST_JWT_SECRET'],
          message: 'GUEST_JWT_SECRET is required and must be at least 32 characters in production',
        });
      }
      if (!data.JWT_ACCESS_SECRET || data.JWT_ACCESS_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_ACCESS_SECRET'],
          message: 'JWT_ACCESS_SECRET is required and must be at least 32 characters in production',
        });
      }
      if (!data.JWT_REFRESH_SECRET || data.JWT_REFRESH_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_REFRESH_SECRET'],
          message: 'JWT_REFRESH_SECRET is required and must be at least 32 characters in production',
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    GUEST_JWT_SECRET:
      data.GUEST_JWT_SECRET || 'codearena_dev_guest_jwt_secret_key_32_bytes_min',
    JWT_ACCESS_SECRET:
      data.JWT_ACCESS_SECRET || 'codearena_dev_access_jwt_secret_key_32_bytes_min',
    JWT_REFRESH_SECRET:
      data.JWT_REFRESH_SECRET || 'codearena_dev_refresh_jwt_secret_key_32_bytes_min',
  }));

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
export default env;

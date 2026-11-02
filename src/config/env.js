import 'dotenv/config';
import { z } from 'zod';

// Validate env at startup so the app fails fast with a clear message
// instead of crashing later on a missing secret.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  parsed.error.issues.forEach((i) => console.error(`- ${i.path.join('.')}: ${i.message}`));
  process.exit(1);
}

export const env = parsed.data;

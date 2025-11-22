import dotenv from 'dotenv';
import { defineConfig } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

dotenv.config();

export default defineConfig({
  schema: './prisma/schema.prisma',
  adapter: async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    return new PrismaPg(pool);
  },
});

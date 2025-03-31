import { config } from 'dotenv';
config(); 

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  // driver: 'better-sqlite3',
  dbCredentials: {
    url: process.env.DATABASE_URL || './data/sqlite.db',
  },
};
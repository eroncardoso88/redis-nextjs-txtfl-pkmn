import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as path from 'path';

const sqlite = new Database(process.env.DATABASE_URL || './data/sqlite.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: path.resolve('./drizzle') });

sqlite.close();
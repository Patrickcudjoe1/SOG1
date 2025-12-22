import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  pgTable,
  serial,
  text,
  jsonb,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL is not set. Postgres connection will not be established.');
}

pg.types.setTypeParser(1016, val => val); 
pg.types.setTypeParser(1009, val => val); 

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export const db = drizzle(pool);

export const store = pgTable('store', {
  id: serial('id').primaryKey(),
  user_id: text('user_id'),
  items: jsonb('items').$type('json'),
  email: text('email').notNull(),
  address: text('address').notNull(),
  total_amount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  reference: text('reference'),
  paid_at: timestamp('paid_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Postgres pool connected');
  } catch (err) {
    console.warn('Postgres connection test failed:', err?.message || err);
  }
};

export default db;

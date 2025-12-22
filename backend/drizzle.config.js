import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./db/index.js', './models/admin.js', './models/productModel.js'],// adjust this path if your schema file is elsewhere
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});



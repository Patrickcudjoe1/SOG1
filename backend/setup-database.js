import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in .env file');
  console.log('\nPlease set DATABASE_URL in backend/.env file');
  console.log('Example: DATABASE_URL=postgresql://user:password@localhost:5432/sog_db');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function setupDatabase() {
  let client;
  try {
    console.log('🔌 Connecting to PostgreSQL...');
    client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    // Extract database name from connection string
    const dbNameMatch = connectionString.match(/\/([^\/\?]+)(\?|$)/);
    const dbName = dbNameMatch ? dbNameMatch[1] : null;

    if (dbName) {
      // Connect to postgres database to create the target database
      const adminConnectionString = connectionString.replace(`/${dbName}`, '/postgres');
      const adminPool = new Pool({
        connectionString: adminConnectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      });

      try {
        const adminClient = await adminPool.connect();
        const dbExists = await adminClient.query(
          `SELECT 1 FROM pg_database WHERE datname = $1`,
          [dbName]
        );

        if (dbExists.rows.length === 0) {
          console.log(`📦 Creating database: ${dbName}...`);
          await adminClient.query(`CREATE DATABASE ${dbName}`);
          console.log(`✅ Database ${dbName} created`);
        } else {
          console.log(`✅ Database ${dbName} already exists`);
        }
        adminClient.release();
        await adminPool.end();
      } catch (err) {
        console.log(`⚠️  Could not create database automatically: ${err.message}`);
        console.log(`   Please create the database manually: CREATE DATABASE ${dbName};`);
      }
    }

    client.release();

    // Run migrations
    console.log('\n📋 Running migrations...');
    const drizzlePath = join(__dirname, 'drizzle');
    const migrationFiles = [
      '0000_fuzzy_jamie_braddock.sql',
      '0001_kind_preak.sql',
      '0002_flat_turbo.sql',
      '0003_amusing_ben_grimm.sql',
      '0004_chemical_kree.sql',
    ];

    const migrationClient = await pool.connect();

    for (const file of migrationFiles) {
      try {
        const filePath = join(drizzlePath, file);
        const sql = readFileSync(filePath, 'utf-8');
        
        // Split by statement-breakpoint and execute each statement
        const statements = sql
          .split('--> statement-breakpoint')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
          if (statement.trim()) {
            await migrationClient.query(statement);
          }
        }
        console.log(`✅ Applied migration: ${file}`);
      } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('does not exist')) {
          console.log(`⚠️  Migration ${file} - ${err.message.split('\n')[0]}`);
        } else {
          console.error(`❌ Error in migration ${file}:`, err.message);
        }
      }
    }

    migrationClient.release();
    await pool.end();

    console.log('\n✅ Database setup complete!');
    console.log('\n📊 Tables created:');
    console.log('   - store (orders)');
    console.log('   - admin');
    console.log('   - products');

  } catch (err) {
    console.error('\n❌ Database setup failed:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Ensure PostgreSQL is installed and running');
    console.log('   2. Check your DATABASE_URL in backend/.env');
    console.log('   3. Verify database credentials are correct');
    if (client) client.release();
    process.exit(1);
  }
}

setupDatabase();


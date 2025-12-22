import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

console.log('🔍 Checking database configuration...\n');

if (!connectionString || connectionString.includes('your_postgresql_connection_string')) {
  console.log('❌ DATABASE_URL is not configured in .env file\n');
  console.log('📝 Please update backend/.env with your database connection string:');
  console.log('   DATABASE_URL=postgresql://user:password@host:port/database\n');
  console.log('💡 Quick options:');
  console.log('   1. Use Supabase (free): https://supabase.com');
  console.log('   2. Use Neon (free): https://neon.tech');
  console.log('   3. Install PostgreSQL locally\n');
  console.log('📖 See QUICK_DATABASE_SETUP.md for detailed instructions\n');
  process.exit(1);
}

console.log('✅ DATABASE_URL is configured');
console.log(`   Connection: ${connectionString.replace(/:[^:@]+@/, ':****@')}\n`);

console.log('🔌 Testing database connection...');

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

try {
  const client = await pool.connect();
  const result = await client.query('SELECT version()');
  console.log('✅ Database connection successful!');
  console.log(`   PostgreSQL version: ${result.rows[0].version.split(',')[0]}\n`);
  
  // Check if tables exist
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  
  if (tablesResult.rows.length > 0) {
    console.log('📊 Existing tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('\n💡 If tables are missing, run: npm run db:setup\n');
  } else {
    console.log('⚠️  No tables found. Run: npm run db:setup\n');
  }
  
  client.release();
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Check if PostgreSQL is running');
  console.log('   2. Verify DATABASE_URL is correct');
  console.log('   3. Check network/firewall settings');
  console.log('   4. See DATABASE_SETUP.md for help\n');
  process.exit(1);
}


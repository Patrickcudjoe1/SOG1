/**
 * Script to check Firebase Admin SDK setup and list all users with their roles
 * 
 * Usage:
 * node scripts/check-admin-setup.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function checkSetup() {
  console.log('🔍 Checking Firebase Admin SDK Setup...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('  ✓ FIREBASE_ADMIN_PROJECT_ID:', process.env.FIREBASE_ADMIN_PROJECT_ID ? '✓ Set' : '❌ Missing');
  console.log('  ✓ FIREBASE_ADMIN_CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? '✓ Set' : '❌ Missing');
  console.log('  ✓ FIREBASE_ADMIN_PRIVATE_KEY:', process.env.FIREBASE_ADMIN_PRIVATE_KEY ? '✓ Set' : '❌ Missing');
  console.log('  ✓ NEXT_PUBLIC_FIREBASE_DATABASE_URL:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? '✓ Set' : '❌ Missing');
  
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || 
      !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
      !process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
      !process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
    console.error('\n❌ Missing required environment variables!');
    console.log('\nMake sure your .env.local file contains all Firebase Admin SDK variables.');
    process.exit(1);
  }
  
  console.log('\n✅ All environment variables present\n');
  
  // Initialize Firebase Admin
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully\n');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    process.exit(1);
  }
  
  // Check database connection
  try {
    const db = admin.database();
    console.log('🔍 Fetching users from database...\n');
    
    const usersSnapshot = await db.ref('users').once('value');
    
    if (!usersSnapshot.exists()) {
      console.log('⚠️  No users found in database');
      console.log('\n💡 To create an admin user:');
      console.log('   1. Sign up through your app: http://localhost:3000/signup');
      console.log('   2. Run: node scripts/set-admin-role.js YOUR_EMAIL@example.com');
      process.exit(0);
    }
    
    console.log('📋 Users in Database:\n');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│ Email                          │ Name              │ Role            │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    
    let adminCount = 0;
    let userCount = 0;
    
    usersSnapshot.forEach((child) => {
      const user = child.val();
      const email = (user.email || '').padEnd(30);
      const name = (user.name || 'N/A').padEnd(15);
      const role = user.role || 'USER';
      
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        adminCount++;
      } else {
        userCount++;
      }
      
      const roleDisplay = role.padEnd(15);
      const icon = (role === 'ADMIN' || role === 'SUPER_ADMIN') ? '🔑' : '👤';
      
      console.log(`│ ${icon} ${email} │ ${name} │ ${roleDisplay} │`);
    });
    
    console.log('└─────────────────────────────────────────────────────────────────────────┘\n');
    
    console.log('Summary:');
    console.log(`  👥 Total Users: ${userCount + adminCount}`);
    console.log(`  🔑 Admins: ${adminCount}`);
    console.log(`  👤 Regular Users: ${userCount}\n`);
    
    if (adminCount === 0) {
      console.log('⚠️  No admin users found!\n');
      console.log('To create an admin user, run:');
      console.log('  node scripts/set-admin-role.js YOUR_EMAIL@example.com\n');
    } else {
      console.log('✅ Admin users are configured\n');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkSetup();
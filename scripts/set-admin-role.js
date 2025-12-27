/**
 * Script to set admin role for a user in Firebase Realtime Database
 * 
 * Usage:
 * node scripts/set-admin-role.js YOUR_EMAIL@example.com
 * 
 * This will:
 * 1. Find the user by email
 * 2. Set their role to ADMIN or SUPER_ADMIN
 * 3. Verify the change
 */

const admin = require('firebase-admin');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

async function setAdminRole(email, role = 'SUPER_ADMIN') {
  try {
    console.log('🔍 Searching for user with email:', email);
    
    // Find user by email
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
    
    if (!snapshot.exists()) {
      console.error('❌ User not found with email:', email);
      console.log('\n💡 Make sure:');
      console.log('   1. The user has signed up in your app');
      console.log('   2. The email is exactly correct (case-sensitive)');
      console.log('   3. The user data is in Firebase Realtime Database under "users"');
      process.exit(1);
    }
    
    // Get user data
    let userId = null;
    let userData = null;
    snapshot.forEach((child) => {
      userId = child.key;
      userData = child.val();
    });
    
    console.log('✅ User found!');
    console.log('   User ID:', userId);
    console.log('   Name:', userData.name || 'N/A');
    console.log('   Email:', userData.email);
    console.log('   Current Role:', userData.role || 'USER');
    
    // Update role
    console.log(`\n🔄 Setting role to: ${role}...`);
    await db.ref(`users/${userId}`).update({
      role: role,
      updatedAt: new Date().toISOString(),
    });
    
    // Verify update
    const updatedSnapshot = await db.ref(`users/${userId}`).once('value');
    const updatedData = updatedSnapshot.val();
    
    console.log('✅ Role updated successfully!');
    console.log('   New Role:', updatedData.role);
    console.log('   Updated At:', updatedData.updatedAt);
    
    console.log('\n🎉 Done! You can now login to the admin panel with this account.');
    console.log('   Admin URL: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin role:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];
const role = process.argv[3] || 'SUPER_ADMIN'; // Default to SUPER_ADMIN

if (!email) {
  console.log('❌ Please provide an email address\n');
  console.log('Usage:');
  console.log('  node scripts/set-admin-role.js YOUR_EMAIL@example.com');
  console.log('  node scripts/set-admin-role.js YOUR_EMAIL@example.com ADMIN');
  console.log('  node scripts/set-admin-role.js YOUR_EMAIL@example.com SUPER_ADMIN');
  console.log('\nRoles:');
  console.log('  ADMIN       - Can access admin panel');
  console.log('  SUPER_ADMIN - Full admin access (recommended)');
  process.exit(1);
}

// Validate role
const validRoles = ['ADMIN', 'SUPER_ADMIN'];
if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role: ${role}`);
  console.log('Valid roles:', validRoles.join(', '));
  process.exit(1);
}

setAdminRole(email, role);
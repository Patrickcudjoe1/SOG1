/**
 * Helper script to encode Firebase Admin Private Key to Base64
 * This makes it safe to use in Vercel environment variables
 * 
 * Usage: node scripts/encode-private-key.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('\n🔐 Firebase Admin Private Key Encoder for Vercel\n');
console.log('═══════════════════════════════════════════════════════\n');

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!privateKey) {
  console.error('❌ FIREBASE_ADMIN_PRIVATE_KEY not found in .env.local\n');
  console.log('Make sure your .env.local file contains:');
  console.log('  FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"\n');
  process.exit(1);
}

// Clean the key (convert \n to actual newlines)
const cleanedKey = privateKey.replace(/\\n/g, '\n');

// Encode to Base64
const encoded = Buffer.from(cleanedKey).toString('base64');

console.log('✅ Private key encoded successfully!\n');
console.log('📋 Copy this value to Vercel:\n');
console.log('┌─────────────────────────────────────────────────────┐');
console.log('│ Variable Name: FIREBASE_ADMIN_PRIVATE_KEY_BASE64   │');
console.log('└─────────────────────────────────────────────────────┘\n');
console.log(encoded);
console.log('\n');
console.log('📝 Instructions:\n');
console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
console.log('2. Click "Add New"');
console.log('3. Name: FIREBASE_ADMIN_PRIVATE_KEY_BASE64');
console.log('4. Value: (paste the encoded string above)');
console.log('5. Select all environments (Production, Preview, Development)');
console.log('6. Click "Save"\n');
console.log('7. Redeploy: vercel --prod\n');
console.log('✨ Your Firebase Admin SDK will work on Vercel!\n');
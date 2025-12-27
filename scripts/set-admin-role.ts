/**
 * Script to set admin role for a user in Firebase Realtime Database
 * 
 * Usage:
 * 1. Set environment variables in .env.local
 * 2. Run: npx tsx scripts/set-admin-role.ts <userId> <role>
 * 
 * Example:
 * npx tsx scripts/set-admin-role.ts xzk6dYebutWUeM3Wf5go2YUTxfR2 SUPER_ADMIN
 */

import { getAdminDatabase } from '../app/lib/firebase/admin'

type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

async function setAdminRole(userId: string, role: UserRole) {
  try {
    console.log(`🔧 Setting role for user ${userId} to ${role}...`)

    // Get admin database
    const db = getAdminDatabase()
    const userRef = db.ref(`users/${userId}`)

    // Check if user exists
    const snapshot = await userRef.get()
    if (!snapshot.exists()) {
      console.error('❌ User not found in database')
      console.log('💡 Make sure the user has signed up first')
      return
    }

    const userData = snapshot.val()
    console.log('📋 Current user data:')
    console.log({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    })

    // Update role
    await userRef.update({
      role,
      updatedAt: new Date().toISOString(),
    })

    console.log(`✅ Successfully updated role to ${role}`)
    
    // Verify update
    const updatedSnapshot = await userRef.get()
    const updatedData = updatedSnapshot.val()
    console.log('✅ Updated user data:')
    console.log({
      id: updatedData.id,
      email: updatedData.email,
      name: updatedData.name,
      role: updatedData.role,
    })

  } catch (error: any) {
    console.error('❌ Error setting admin role:', error.message)
    throw error
  }
}

async function listUsers() {
  try {
    console.log('📋 Fetching all users...\n')
    
    const db = getAdminDatabase()
    const usersRef = db.ref('users')
    const snapshot = await usersRef.get()
    
    if (!snapshot.exists()) {
      console.log('No users found in database')
      return
    }
    
    const users: any[] = []
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val()
      users.push(userData)
    })
    
    console.log(`Found ${users.length} users:\n`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.createdAt}\n`)
    })
    
  } catch (error: any) {
    console.error('❌ Error listing users:', error.message)
    throw error
  }
}

// Main execution
const args = process.argv.slice(2)
const command = args[0]

if (!command) {
  console.log('Usage:')
  console.log('  npx tsx scripts/set-admin-role.ts list')
  console.log('  npx tsx scripts/set-admin-role.ts <userId> <role>')
  console.log('')
  console.log('Available roles: USER, ADMIN, SUPER_ADMIN')
  console.log('')
  console.log('Examples:')
  console.log('  npx tsx scripts/set-admin-role.ts list')
  console.log('  npx tsx scripts/set-admin-role.ts xzk6dYebutWUeM3Wf5go2YUTxfR2 SUPER_ADMIN')
  process.exit(1)
}

if (command === 'list') {
  listUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
} else {
  const userId = command
  const role = args[1]?.toUpperCase() as UserRole

  if (!role || !['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    console.error('❌ Invalid role. Must be: USER, ADMIN, or SUPER_ADMIN')
    process.exit(1)
  }

  setAdminRole(userId, role)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
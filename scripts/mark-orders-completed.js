#!/usr/bin/env node

/**
 * Mark Orders as Completed Script
 * 
 * Manually updates orders that were paid but webhook didn't process
 */

require('dotenv').config({ path: '.env.local' })
const admin = require('firebase-admin')
const readline = require('readline')

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.database()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function markOrdersCompleted() {
  console.log('🔧 Mark Orders as Completed Tool\n')
  console.log('⚠️  WARNING: This will manually update payment status in Firebase')
  console.log('Only mark orders as COMPLETED if you verified payment in Paystack dashboard!\n')

  try {
    // Fetch all PENDING orders
    const ordersRef = db.ref('orders')
    const snapshot = await ordersRef.get()

    if (!snapshot.exists()) {
      console.log('❌ No orders found\n')
      rl.close()
      return
    }

    const allOrders = []
    snapshot.forEach((childSnapshot) => {
      allOrders.push(childSnapshot.val())
    })

    const pendingOrders = allOrders.filter(o => o.paymentStatus === 'PENDING')

    if (pendingOrders.length === 0) {
      console.log('✅ No pending orders found! All orders are already processed.\n')
      rl.close()
      return
    }

    console.log(`📋 Found ${pendingOrders.length} PENDING order(s):\n`)

    pendingOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.orderNumber}`)
      console.log(`   Amount: ₵${order.totalAmount.toFixed(2)}`)
      console.log(`   Email: ${order.email}`)
      console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`)
      console.log(`   Payment Method: ${order.paymentMethod || 'N/A'}`)
      if (order.paystackReference) {
        console.log(`   Paystack Ref: ${order.paystackReference}`)
      }
      console.log('')
    })

    const totalPending = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    console.log(`💰 Total Pending: ₵${totalPending.toFixed(2)}\n`)

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('BEFORE YOU PROCEED:')
    console.log('1. Check Paystack Dashboard: https://dashboard.paystack.com/transactions')
    console.log('2. Verify which orders were actually PAID by customers')
    console.log('3. Only mark those orders as COMPLETED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const proceed = await question('Do you want to proceed? (yes/no): ')
    
    if (proceed.toLowerCase() !== 'yes') {
      console.log('\n❌ Cancelled. No changes made.')
      rl.close()
      return
    }

    console.log('\n📝 Select orders to mark as COMPLETED:')
    console.log('   - Enter order numbers separated by commas (e.g., 1,3,5)')
    console.log('   - Or type "all" to mark all as completed')
    console.log('   - Or type "none" to cancel\n')

    const selection = await question('Your selection: ')
    
    if (selection.toLowerCase() === 'none') {
      console.log('\n❌ Cancelled. No changes made.')
      rl.close()
      return
    }

    let ordersToUpdate = []
    
    if (selection.toLowerCase() === 'all') {
      ordersToUpdate = pendingOrders
    } else {
      const indices = selection.split(',').map(s => parseInt(s.trim()) - 1)
      ordersToUpdate = indices
        .filter(i => i >= 0 && i < pendingOrders.length)
        .map(i => pendingOrders[i])
    }

    if (ordersToUpdate.length === 0) {
      console.log('\n❌ No valid orders selected.')
      rl.close()
      return
    }

    console.log(`\n🔄 Updating ${ordersToUpdate.length} order(s)...`)

    const now = new Date().toISOString()
    let successCount = 0
    let failCount = 0

    for (const order of ordersToUpdate) {
      try {
        await ordersRef.child(order.id).update({
          paymentStatus: 'COMPLETED',
          status: 'PROCESSING',
          webhookProcessed: true,
          paidAt: now,
          updatedAt: now,
        })
        console.log(`✅ ${order.orderNumber} - COMPLETED`)
        successCount++
      } catch (error) {
        console.error(`❌ ${order.orderNumber} - FAILED:`, error.message)
        failCount++
      }
    }

    const updatedRevenue = ordersToUpdate.reduce((sum, o) => sum + o.totalAmount, 0)

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ UPDATE COMPLETE!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Success: ${successCount} order(s)`)
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} order(s)`)
    }
    console.log(`💰 Revenue Updated: ₵${updatedRevenue.toFixed(2)}`)
    console.log('\n📊 Next Steps:')
    console.log('1. Check admin dashboard - revenue should now show!')
    console.log('2. Run: npm run orders:check')
    console.log('3. Set up Paystack webhook for future orders')
    console.log('   Read: WEBHOOK_SETUP_GUIDE.md\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
  } finally {
    rl.close()
    process.exit(0)
  }
}

markOrdersCompleted()
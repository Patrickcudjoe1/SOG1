#!/usr/bin/env node

/**
 * Check Order Payment Statuses Script
 * 
 * This script checks all orders in the database and shows their payment statuses
 * to help diagnose revenue calculation issues.
 */

require('dotenv').config({ path: '.env.local' })
const admin = require('firebase-admin')

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

async function checkOrderStatuses() {
  console.log('🔍 Checking Order Payment Statuses...\n')

  try {
    const ordersRef = db.ref('orders')
    const snapshot = await ordersRef.get()

    if (!snapshot.exists()) {
      console.log('❌ No orders found in database\n')
      return
    }

    const orders = []
    snapshot.forEach((childSnapshot) => {
      orders.push(childSnapshot.val())
    })

    console.log(`📊 Total Orders: ${orders.length}\n`)

    // Group by payment status
    const byPaymentStatus = {}
    const byOrderStatus = {}
    let totalRevenue = 0
    let completedRevenue = 0

    orders.forEach(order => {
      // Count by payment status
      byPaymentStatus[order.paymentStatus] = (byPaymentStatus[order.paymentStatus] || 0) + 1
      
      // Count by order status
      byOrderStatus[order.status] = (byOrderStatus[order.status] || 0) + 1
      
      // Calculate revenue
      totalRevenue += order.totalAmount
      if (order.paymentStatus === 'COMPLETED') {
        completedRevenue += order.totalAmount
      }
    })

    console.log('💳 Payment Status Breakdown:')
    console.log('─────────────────────────────')
    Object.entries(byPaymentStatus).forEach(([status, count]) => {
      const emoji = status === 'COMPLETED' ? '✅' : status === 'PENDING' ? '⏳' : '❌'
      console.log(`${emoji} ${status}: ${count} order(s)`)
    })

    console.log('\n📦 Order Status Breakdown:')
    console.log('─────────────────────────────')
    Object.entries(byOrderStatus).forEach(([status, count]) => {
      const emoji = status === 'DELIVERED' ? '✅' : status === 'PROCESSING' ? '🔄' : status === 'PENDING' ? '⏳' : '❌'
      console.log(`${emoji} ${status}: ${count} order(s)`)
    })

    console.log('\n💰 Revenue Summary:')
    console.log('─────────────────────────────')
    console.log(`Total (All Orders): ₵${totalRevenue.toFixed(2)}`)
    console.log(`Completed Orders Only: ₵${completedRevenue.toFixed(2)} ✅`)
    console.log(`Pending: ₵${(totalRevenue - completedRevenue).toFixed(2)}`)

    console.log('\n📋 Recent Orders (Last 5):')
    console.log('─────────────────────────────')
    
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    recentOrders.forEach((order, index) => {
      const paymentEmoji = order.paymentStatus === 'COMPLETED' ? '✅' : order.paymentStatus === 'PENDING' ? '⏳' : '❌'
      const orderEmoji = order.status === 'DELIVERED' ? '✅' : order.status === 'PROCESSING' ? '🔄' : '⏳'
      
      console.log(`\n${index + 1}. ${order.orderNumber}`)
      console.log(`   Amount: ₵${order.totalAmount.toFixed(2)}`)
      console.log(`   Payment: ${paymentEmoji} ${order.paymentStatus}`)
      console.log(`   Order Status: ${orderEmoji} ${order.status}`)
      console.log(`   Webhook Processed: ${order.webhookProcessed ? '✅' : '❌'}`)
      console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`)
      if (order.paidAt) {
        console.log(`   Paid At: ${new Date(order.paidAt).toLocaleString()}`)
      }
    })

    // Check for webhook issues
    const webhookNotProcessed = orders.filter(o => !o.webhookProcessed && o.paymentStatus === 'PENDING')
    
    if (webhookNotProcessed.length > 0) {
      console.log('\n⚠️  WEBHOOK ISSUES DETECTED:')
      console.log('─────────────────────────────')
      console.log(`${webhookNotProcessed.length} order(s) have PENDING payment with webhookProcessed = false`)
      console.log('\nPossible causes:')
      console.log('1. Paystack webhook not configured')
      console.log('2. Webhook URL is incorrect')
      console.log('3. Payment was not completed by user')
      console.log('4. Network connectivity issues')
      console.log('\n✅ Action Required:')
      console.log('- Check Paystack Dashboard > Settings > Webhooks')
      console.log('- Verify webhook URL: https://your-domain.com/api/webhooks/paystack')
      console.log('- Test with Paystack test mode')
    }

    if (completedRevenue === 0 && orders.length > 0) {
      console.log('\n🚨 CRITICAL: NO COMPLETED PAYMENTS FOUND!')
      console.log('─────────────────────────────')
      console.log('This is why admin dashboard shows ₵0.00 revenue.')
      console.log('\n✅ Action Required:')
      console.log('1. Make a test payment with Paystack test card')
      console.log('2. Verify webhook processes the payment')
      console.log('3. Check order status updates to COMPLETED')
      console.log('4. Verify revenue appears in admin dashboard')
    }

  } catch (error) {
    console.error('❌ Error checking order statuses:', error)
  } finally {
    process.exit(0)
  }
}

checkOrderStatuses()
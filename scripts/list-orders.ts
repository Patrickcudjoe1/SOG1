/**
 * List all orders in the database
 * 
 * Usage:
 * npx tsx scripts/list-orders.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { getAdminDatabase } from '../app/lib/firebase/admin'

async function listOrders() {
  try {
    console.log('📋 Fetching all orders...\n')
    
    const db = getAdminDatabase()
    const ordersRef = db.ref('orders')
    const snapshot = await ordersRef.once('value')
    
    if (!snapshot.exists()) {
      console.log('❌ No orders found in database')
      console.log('\n💡 Create an order first by:')
      console.log('   1. Go to your website')
      console.log('   2. Add items to cart')
      console.log('   3. Complete checkout')
      return
    }
    
    const orders: any[] = []
    snapshot.forEach((childSnapshot) => {
      const orderData = childSnapshot.val()
      orders.push(orderData)
    })
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    
    console.log(`Found ${orders.length} orders:\n`)
    console.log('─'.repeat(80))
    
    orders.forEach((order, index) => {
      const statusEmoji = 
        order.paymentStatus === 'COMPLETED' ? '✅' :
        order.paymentStatus === 'PENDING' ? '⏳' :
        order.paymentStatus === 'FAILED' ? '❌' : '❓'
      
      console.log(`\n${index + 1}. ${statusEmoji} ${order.orderNumber}`)
      console.log(`   Email: ${order.email}`)
      console.log(`   Total: ₵${order.totalAmount}`)
      console.log(`   Payment Status: ${order.paymentStatus}`)
      console.log(`   Order Status: ${order.status}`)
      console.log(`   Paystack Ref: ${order.paystackReference || 'Not set'}`)
      console.log(`   Webhook Processed: ${order.webhookProcessed || false}`)
      console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`)
      
      if (order.paymentStatus === 'PENDING') {
        console.log(`   \n   💡 Test this order: npx tsx scripts/test-paystack-webhook.ts ${order.orderNumber}`)
      }
    })
    
    console.log('\n' + '─'.repeat(80))
    
    // Summary
    const pendingCount = orders.filter(o => o.paymentStatus === 'PENDING').length
    const completedCount = orders.filter(o => o.paymentStatus === 'COMPLETED').length
    const failedCount = orders.filter(o => o.paymentStatus === 'FAILED').length
    
    console.log('\n📊 Summary:')
    console.log(`   Total Orders: ${orders.length}`)
    console.log(`   ✅ Completed: ${completedCount}`)
    console.log(`   ⏳ Pending: ${pendingCount}`)
    console.log(`   ❌ Failed: ${failedCount}`)
    
    if (pendingCount > 0) {
      console.log('\n💡 You can test webhook processing on pending orders using:')
      console.log('   npx tsx scripts/test-paystack-webhook.ts <orderNumber>')
    }
    
  } catch (error: any) {
    console.error('❌ Error listing orders:', error.message)
    console.error('\nFull error:', error)
  }
}

listOrders()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
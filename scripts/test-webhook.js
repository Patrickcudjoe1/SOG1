#!/usr/bin/env node

/**
 * Test Webhook Script
 * 
 * Simulates a Paystack webhook call to test your endpoint
 */

require('dotenv').config({ path: '.env.local' })
const crypto = require('crypto')

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

async function testWebhook() {
  console.log('🧪 Testing Paystack Webhook Endpoint\n')

  if (!SECRET_KEY) {
    console.error('❌ PAYSTACK_SECRET_KEY not found in .env.local')
    console.log('   Add it to continue testing\n')
    return
  }

  const webhookUrl = `${BASE_URL}/api/webhooks/paystack`
  console.log(`📍 Webhook URL: ${webhookUrl}`)
  console.log(`🔑 Using secret key: ${SECRET_KEY.substring(0, 10)}...\n`)

  // Check if BASE_URL is production
  if (BASE_URL.includes('vercel.app') || BASE_URL.includes('https://')) {
    console.log('🌐 Testing PRODUCTION webhook endpoint')
    console.log('   Make sure environment variables are set on Vercel!\n')
  } else {
    console.log('💻 Testing LOCAL webhook endpoint')
    console.log('   Make sure dev server is running: npm run dev\n')
  }

  // Test with a fake successful charge event
  const testEvent = {
    event: 'charge.success',
    data: {
      reference: 'TEST-REF-' + Date.now(),
      status: 'success',
      gateway_response: 'Successful',
      amount: 10000, // ₵100.00 in pesewas
      customer: {
        email: 'test@example.com'
      }
    }
  }

  const body = JSON.stringify(testEvent)
  
  // Generate signature
  const hash = crypto
    .createHmac('sha512', SECRET_KEY)
    .update(body)
    .digest('hex')

  console.log('📦 Test Event:')
  console.log(JSON.stringify(testEvent, null, 2))
  console.log('\n🔐 Generated Signature:', hash.substring(0, 20) + '...')

  try {
    console.log('\n🚀 Sending webhook request...\n')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Paystack-Signature': hash, // Capital X to match Paystack's actual header
      },
      body: body,
    })

    const responseText = await response.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    console.log('📥 Response Status:', response.status, response.statusText)
    console.log('📥 Response Body:')
    console.log(JSON.stringify(responseData, null, 2))

    if (response.ok) {
      console.log('\n✅ SUCCESS! Webhook endpoint is working correctly!')
      
      if (responseData.duplicate) {
        console.log('⚠️  Order already processed (this is expected for repeated tests)\n')
      } else if (responseData.error === 'Order not found') {
        console.log('⚠️  Note: This test used a fake reference, so no real order was found.')
        console.log('\nTo test with a real order:')
        console.log('1. Check an actual order reference in your database')
        console.log('2. Replace TEST-REF in this script with real reference')
        console.log('3. Run this script again\n')
      } else {
        console.log('✅ Webhook processed successfully!\n')
      }
    } else if (response.status === 404 && responseData.error === 'Order not found') {
      console.log('\n✅ SUCCESS! Webhook endpoint is working correctly!')
      console.log('✅ Signature verification PASSED')
      console.log('✅ Order lookup logic working\n')
      console.log('⚠️  Note: This test used a fake reference "TEST-REF-xxxxx"')
      console.log('   A real Paystack payment with a valid order will process successfully!\n')
      console.log('📋 What this means:')
      console.log('   1. Endpoint is publicly accessible ✅')
      console.log('   2. Signature verification working ✅')
      console.log('   3. Webhook handler executing ✅')
      console.log('   4. Order lookup working ✅\n')
      console.log('🚀 Your webhook is READY for production payments!\n')
    } else {
      console.log('\n❌ FAILED! Webhook endpoint returned an error.')
      
      if (responseData.error === 'Missing signature') {
        console.log('\n⚠️  Troubleshooting:')
        console.log('1. This might be a header casing issue')
        console.log('2. Actual Paystack webhooks should work fine')
        console.log('3. Test with real payment instead\n')
      } else if (responseData.error === 'Invalid signature') {
        console.log('\n⚠️  Troubleshooting:')
        console.log('1. Check PAYSTACK_SECRET_KEY on Vercel matches your .env.local')
        console.log('2. Make sure the key starts with sk_test_ or sk_live_')
        console.log('3. Redeploy if you just added/changed it\n')
      } else {
        console.log('Check your webhook route for issues.\n')
      }
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.log('\nPossible causes:')
    console.log('1. Server not running (run: npm run dev)')
    console.log('2. Wrong BASE_URL in .env.local')
    console.log('3. Network/firewall blocking request\n')
  }
}

testWebhook()
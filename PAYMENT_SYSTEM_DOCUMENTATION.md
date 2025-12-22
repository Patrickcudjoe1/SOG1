# Secure Checkout and Payment System Documentation

## Overview

This document describes the secure checkout and payment system implemented in the Next.js e-commerce application. The system supports multiple payment methods with webhook-based confirmation and duplicate payment prevention.

## Features

- ✅ **Secure API Routes** - All payment endpoints use server-side validation
- ✅ **Stripe Integration** - Card payments with webhook verification
- ✅ **Paystack Integration** - Mobile Money payments for Ghana
- ✅ **Webhook Handlers** - Secure payment confirmation via webhooks
- ✅ **Idempotency Keys** - Prevents duplicate payments
- ✅ **Server-Side Validation** - Cart validation before order creation
- ✅ **Order Management** - Orders created before payment, updated via webhooks

## Payment Methods

### 1. Card Payments (Stripe)

**Endpoint:** `/api/checkout/create`

**Flow:**
1. Client submits checkout form
2. Server validates cart and creates order (status: PENDING)
3. Stripe checkout session created
4. User redirected to Stripe payment page
5. After payment, Stripe webhook confirms payment
6. Order status updated to PROCESSING

**Webhook:** `/api/webhooks/stripe`

### 2. Mobile Money (Paystack)

**Endpoint:** `/api/checkout/paystack`

**Flow:**
1. Client submits checkout form with mobile money details
2. Server validates cart and creates order (status: PENDING)
3. Paystack payment initialized
4. User redirected to Paystack payment page
5. After payment, Paystack webhook confirms payment
6. Order status updated to PROCESSING

**Webhook:** `/api/webhooks/paystack`

## Security Features

### 1. Idempotency Keys

Every payment request includes a unique idempotency key to prevent duplicate payments:

```typescript
const idempotencyKey = generateIdempotencyKey()
```

The system checks for existing orders with the same key before processing.

### 2. Webhook Signature Verification

All webhooks verify signatures before processing:

- **Stripe:** Uses `stripe.webhooks.constructEvent()` to verify signature
- **Paystack:** Uses HMAC SHA-512 to verify signature

### 3. Server-Side Validation

- Cart items validated against product database
- Prices and quantities verified
- Email and phone number format validation
- Amount sanitization to prevent manipulation

### 4. Order Creation Flow

Orders are created **before** payment to ensure:
- Inventory can be reserved
- Order tracking is available
- Payment can be linked to order

Payment status is updated via webhook after successful payment.

## Database Schema

### Order Model

```prisma
model Order {
  id                      String      @id @default(auto())
  orderNumber             String      @unique
  userId                  String?
  status                  OrderStatus @default(PENDING)
  paymentStatus           PaymentStatus @default(PENDING)
  
  // Stripe
  stripePaymentIntentId   String?
  stripeSessionId         String?
  
  // Paystack
  paystackReference      String?
  
  // Mobile Money
  mobileMoneyTransactionId String?
  mobileMoneyProvider     String?
  mobileMoneyPhone        String?
  
  // Security
  idempotencyKey          String?     @unique
  webhookProcessed        Boolean     @default(false)
  
  // Amounts
  subtotal                Float
  shippingCost            Float
  discountAmount          Float
  totalAmount             Float
  
  // Relations
  items                   OrderItem[]
  shippingAddress         Address?
}
```

## API Endpoints

### Checkout Endpoints

#### `POST /api/checkout/create`
Creates Stripe checkout session for card payments.

**Request Body:**
```json
{
  "items": [...],
  "shipping": {...},
  "deliveryMethod": "standard",
  "subtotal": 100.00,
  "shippingCost": 10.00,
  "discount": 0,
  "total": 110.00,
  "promoCode": null
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### `POST /api/checkout/paystack`
Initializes Paystack payment for mobile money.

**Request Body:**
```json
{
  "items": [...],
  "shipping": {...},
  "mobileMoneyPhone": "0241234567",
  "mobileMoneyProvider": "mtn",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "authorizationUrl": "https://paystack.com/...",
  "reference": "SOG-...",
  "orderId": "...",
  "orderNumber": "SOG-..."
}
```

#### `GET /api/checkout/verify`
Verifies payment status for an order.

**Query Parameters:**
- `orderId` - Order ID
- `session_id` - Stripe session ID
- `reference` - Paystack reference

**Response:**
```json
{
  "orderId": "...",
  "orderNumber": "SOG-...",
  "paymentStatus": "COMPLETED",
  "orderStatus": "PROCESSING",
  "paid": true
}
```

### Webhook Endpoints

#### `POST /api/webhooks/stripe`
Handles Stripe webhook events.

**Events Handled:**
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed

**Security:**
- Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
- Checks for duplicate processing using `webhookProcessed` flag

#### `POST /api/webhooks/paystack`
Handles Paystack webhook events.

**Events Handled:**
- `charge.success` - Payment successful
- `charge.failed` - Payment failed

**Security:**
- Verifies webhook signature using HMAC SHA-512
- Checks for duplicate processing using `webhookProcessed` flag

## Environment Variables

Required environment variables:

```env
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Paystack
PAYSTACK_SECRET_KEY="sk_test_..."

# Base URL
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

## Webhook Setup

### Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Paystack Webhook

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/paystack`
3. Select events:
   - `charge.success`
   - `charge.failed`
4. The webhook secret is your `PAYSTACK_SECRET_KEY`

## Payment Flow Diagram

```
Client → Checkout Form
  ↓
Server Validation (Cart, Email, Phone)
  ↓
Generate Idempotency Key
  ↓
Check for Duplicate Order
  ↓
Create Order (Status: PENDING)
  ↓
Initialize Payment Gateway
  ↓
Redirect to Payment Page
  ↓
User Completes Payment
  ↓
Payment Gateway → Webhook
  ↓
Verify Webhook Signature
  ↓
Check for Duplicate Processing
  ↓
Update Order (Status: PROCESSING, Payment: COMPLETED)
  ↓
Send Confirmation Email
```

## Error Handling

### Duplicate Payment Prevention

If a duplicate idempotency key is detected:

```json
{
  "error": "Duplicate payment detected",
  "orderId": "...",
  "orderNumber": "SOG-..."
}
```

Status: `409 Conflict`

### Webhook Duplicate Processing

If a webhook event is processed twice:

```json
{
  "received": true,
  "duplicate": true
}
```

The system returns success but doesn't process the event again.

## Testing

### Test Card Payments (Stripe)

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test Mobile Money (Paystack)

Use Paystack test credentials:
- Test phone: `08012345678`
- Test OTP: `123456`

## Production Checklist

- [ ] Set up production Stripe account
- [ ] Set up production Paystack account
- [ ] Configure webhook endpoints
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Enable HTTPS
- [ ] Test webhook delivery
- [ ] Monitor webhook logs
- [ ] Set up error alerting
- [ ] Test duplicate payment prevention
- [ ] Verify email delivery

## Security Best Practices

1. **Never expose secret keys** - Keep all secret keys server-side
2. **Always verify webhooks** - Verify signatures before processing
3. **Use idempotency keys** - Prevent duplicate payments
4. **Validate server-side** - Never trust client data
5. **Sanitize amounts** - Round to 2 decimal places
6. **Log all transactions** - For auditing and debugging
7. **Monitor webhook delivery** - Set up alerts for failures

## Support

For issues or questions:
1. Check webhook logs in payment gateway dashboards
2. Review order status in database
3. Check server logs for errors
4. Verify environment variables are set correctly


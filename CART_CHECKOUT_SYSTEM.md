# Cart and Checkout System Documentation

## Overview

A complete, production-ready cart and checkout system with the following features:

- **Cart Management**: View, edit, increase/decrease quantities, remove items
- **Cart Persistence**: Cart saved to localStorage, persists across page reloads
- **Guest & Authenticated Checkout**: Works for both logged-in users and guests
- **Shipping Address Form**: Full validation for Ghana addresses
- **Delivery Options**: Standard, Express, and Store Pickup
- **Promo Codes**: Support for percentage and fixed discounts
- **Payment Methods**: Card payments (Stripe) and Mobile Money (MTN, Vodafone, AirtelTigo)
- **Order Confirmation**: Success page with order details
- **Email Notifications**: Order confirmation emails (ready for integration)

## Architecture

### Frontend Components

1. **CartContext** (`app/components/CartContext.tsx`)
   - Manages cart state with localStorage persistence
   - Methods: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
   - Auto-saves to localStorage on every change

2. **Cart Page** (`app/cart/page.tsx`)
   - Displays all cart items with images
   - Quantity controls (increase/decrease)
   - Remove items functionality
   - Order summary sidebar
   - Link to checkout

3. **Checkout Page** (`app/checkout/page.tsx`)
   - Shipping address form with validation
   - Delivery method selection
   - Payment method selection (Card/Mobile Money)
   - Promo code input and validation
   - Order summary with real-time totals

4. **Order Success Page** (`app/checkout/success/page.tsx`)
   - Displays order confirmation
   - Shows order number and details
   - Email confirmation notice

### Backend API Routes

1. **`/api/promo/validate`** - Validates and calculates promo code discounts
2. **`/api/checkout/create`** - Creates Stripe checkout session for card payments
3. **`/api/checkout/mobile-money`** - Processes mobile money payments
4. **`/api/checkout/verify`** - Verifies Stripe payment completion
5. **`/api/checkout/webhook`** - Stripe webhook handler for payment events
6. **`/api/orders/[id]`** - Fetches order details
7. **`/api/orders/[id]/send-email`** - Sends order confirmation email

### Database Schema

**Order Model:**
- Order number (unique, human-readable)
- User ID (optional for guest checkout)
- Status, payment status
- Totals (subtotal, shipping, discount, total)
- Payment method and transaction IDs
- Delivery method and notes
- Shipping address relation

**OrderItem Model:**
- Product details (ID, name, image, price)
- Quantity, size, color
- Links to parent order

**Address Model:**
- Full shipping address
- Optional user relation (for guest checkout)
- Used for order shipping

**PromoCode Model:**
- Code, description
- Discount type (percentage/fixed)
- Discount value, min purchase, max discount
- Usage limits and validity dates

## Setup Instructions

### 1. Database Migration

Run Prisma migrations to update your database schema:

```bash
npx prisma migrate dev --name add_cart_checkout_system
npx prisma generate
```

### 2. Environment Variables

Ensure these are set in your `.env` file:

```env
DATABASE_URL="your_mongodb_connection_string"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # For production webhooks
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Or your production URL
```

### 3. Stripe Webhook Setup (Production)

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/checkout/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Seed Sample Promo Codes (Optional)

Create a script to seed promo codes:

```typescript
// scripts/seed-promo-codes.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: '10% off your first order',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchase: 50,
        maxDiscount: 20,
        usageLimit: 1000,
      },
      {
        code: 'SAVE20',
        description: '₵20 off orders over ₵100',
        discountType: 'FIXED',
        discountValue: 20,
        minPurchase: 100,
        usageLimit: 500,
      },
      {
        code: 'FREESHIP',
        description: 'Free shipping on any order',
        discountType: 'FIXED',
        discountValue: 15, // Assuming standard shipping is ₵15
        minPurchase: 0,
        usageLimit: null, // Unlimited
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with: `npx tsx scripts/seed-promo-codes.ts`

## Usage

### Adding Items to Cart

Items are automatically added when users click "Add to Cart" on product pages. The cart persists in localStorage.

### Cart Management

- **View Cart**: Navigate to `/cart`
- **Update Quantity**: Use +/- buttons on cart items
- **Remove Item**: Click trash icon
- **Clear Cart**: Click "Clear Cart" button

### Checkout Flow

1. User clicks "Proceed to Checkout" from cart
2. Fills out shipping information
3. Selects delivery method
4. (Optional) Applies promo code
5. Selects payment method
6. For card payments: Redirected to Stripe Checkout
7. For mobile money: Payment processed immediately
8. Redirected to success page with order confirmation

### Promo Code System

Promo codes support:
- **Percentage discounts**: e.g., 10% off
- **Fixed discounts**: e.g., ₵20 off
- **Minimum purchase requirements**
- **Maximum discount caps** (for percentage)
- **Usage limits**
- **Validity dates**

### Mobile Money Integration

Currently simulates mobile money payments. To integrate with real providers:

1. **Flutterwave**: Use Flutterwave Rave API
2. **Paystack**: Use Paystack Mobile Money API
3. **MTN/Vodafone Direct**: Contact providers for API access

Update `app/api/checkout/mobile-money/route.ts` with actual API calls.

### Email Integration

The system is ready for email integration. Update `app/api/orders/[id]/send-email/route.ts` with your email service:

**Option 1: Resend**
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'orders@sonofgod.com',
  to: emailContent.to,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

**Option 2: SendGrid**
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send({
  to: emailContent.to,
  from: 'orders@sonofgod.com',
  subject: emailContent.subject,
  html: emailContent.html,
});
```

## Security Considerations

1. **Input Validation**: All forms validate on both client and server
2. **Phone Number Validation**: Ghana phone format (0XXXXXXXXX)
3. **Promo Code Validation**: Server-side validation with usage limits
4. **Payment Security**: Stripe handles all card payment security
5. **Order Verification**: Stripe webhooks verify payment completion
6. **Guest Checkout**: Orders can be created without user accounts

## Testing

### Test Promo Codes

Create test promo codes in your database:
- `TEST10` - 10% off, no minimum
- `TEST20` - ₵20 off, min ₵100

### Test Payment Flow

1. **Card Payments**: Use Stripe test cards (4242 4242 4242 4242)
2. **Mobile Money**: Currently simulates success

### Test Scenarios

- Empty cart checkout (should redirect)
- Invalid promo codes
- Expired promo codes
- Promo codes exceeding usage limit
- Guest checkout
- Authenticated user checkout

## Future Enhancements

1. **Saved Addresses**: Allow users to save multiple addresses
2. **Order History**: Display past orders in account page
3. **Order Tracking**: Real-time shipping updates
4. **Wishlist**: Save items for later
5. **Abandoned Cart Recovery**: Email reminders for incomplete checkouts
6. **Multi-currency Support**: Support for other currencies
7. **Gift Cards**: Support for gift card payments

## Troubleshooting

### Cart Not Persisting
- Check browser localStorage is enabled
- Verify CartContext is properly mounted in ClientRoot

### Stripe Checkout Not Working
- Verify STRIPE_SECRET_KEY is set
- Check Stripe API version compatibility
- Ensure checkout session creation succeeds

### Promo Codes Not Working
- Verify promo code exists in database
- Check validity dates
- Verify usage limits not exceeded
- Check minimum purchase requirements

### Email Not Sending
- Email service not integrated (currently logs to console)
- Integrate with Resend, SendGrid, or AWS SES
- Check email service API keys

## Support

For issues or questions, check:
- Prisma logs for database errors
- Stripe Dashboard for payment issues
- Browser console for client-side errors
- Server logs for API errors


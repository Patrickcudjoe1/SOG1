# Paystack Integration Setup

## ✅ Credentials Configured

Your Paystack test credentials have been integrated:

- **Secret Key**: `sk_test_bd198ba33cea1961bea8d0c45c731afd34e1dd79`
- **Public Key**: `pk_test_05904121cea914f5151cc513f68f742a508cd465`

## Environment Variables

The credentials have been added to:
- `.env.local` (Frontend/Next.js)
  - `PAYSTACK_SECRET_KEY`
  - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `backend/.env` (Backend - if exists)
  - `PAYSTACK_SECRET_KEY`

## Integration Points

### 1. Payment Initialization
**File**: `app/api/checkout/paystack/route.ts`
- Uses `PAYSTACK_SECRET_KEY` to initialize Paystack transactions
- Creates orders and redirects to Paystack payment page

### 2. Webhook Handler
**File**: `app/api/webhooks/paystack/route.ts`
- Uses `PAYSTACK_SECRET_KEY` to verify webhook signatures
- Processes payment confirmations and updates order status

### 3. Checkout Page
**File**: `app/checkout/page.tsx`
- Calls `/api/checkout/paystack` endpoint
- Redirects to Paystack authorization URL

## Next Steps

### 1. Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Configure Webhook URL in Paystack Dashboard
1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Add webhook URL:
   - **Development**: `http://localhost:3000/api/webhooks/paystack`
   - **Production**: `https://your-domain.com/api/webhooks/paystack`

### 3. Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill in shipping information
4. Select payment method (Card or Mobile Money)
5. Complete payment on Paystack page

## Payment Methods Supported

- ✅ **Card Payments** (via Paystack)
- ✅ **Mobile Money** (MTN, Vodafone, AirtelTigo via Paystack)

## Testing

### Test Cards (Paystack Test Mode)
- **Successful Payment**: `4084084084084081`
- **Declined Payment**: `5060666666666666666`
- **Insufficient Funds**: `5060666666666666667`

**CVV**: Any 3 digits  
**Expiry**: Any future date  
**PIN**: Any 4 digits

### Test Mobile Money
- Use any valid Ghana phone number
- Select provider (MTN, Vodafone, AirtelTigo)
- Complete payment on Paystack page

## Production Setup

When ready for production:

1. **Get Live Keys** from Paystack Dashboard
2. **Update Environment Variables**:
   ```env
   PAYSTACK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
   ```
3. **Update Webhook URL** to production domain
4. **Test thoroughly** before going live

## Security Notes

- ✅ Secret keys are stored in `.env.local` (gitignored)
- ✅ Webhook signatures are verified
- ✅ Idempotency keys prevent duplicate payments
- ✅ Server-side validation of all payment data

## Support

For Paystack API documentation:
- [Paystack API Docs](https://paystack.com/docs/api/)
- [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)


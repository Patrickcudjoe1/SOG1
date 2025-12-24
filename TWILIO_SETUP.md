# Twilio SMS Integration Setup

## ✅ Credentials Configured

Your Twilio test credentials have been integrated:

- **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (configured in .env.local)
- **Auth Token**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (configured in .env.local)

## Environment Variables

The credentials have been added to:
- `.env.local` (Frontend/Next.js)
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`

## Integration with Supabase

Twilio is used by **Supabase Auth** to send SMS OTP codes for phone number authentication. The integration happens in the Supabase dashboard, not directly in the code.

## Supabase Configuration Steps

### 1. Enable Phone Auth in Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Enable **Phone** provider

### 2. Configure Twilio in Supabase
1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Scroll to **Phone Auth** section
3. Configure **SMS Provider**:
   - Select **Twilio**
   - Enter your Twilio credentials:
     - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (from your Twilio Console)
     - **Auth Token**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (from your Twilio Console)
   - **From Phone Number**: Your Twilio phone number (format: +1234567890)
4. Click **Save**

### 3. Get Twilio Phone Number
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. If you don't have a number, purchase one:
   - Click **Buy a number**
   - Select **Ghana** (or your country)
   - Choose a number
   - Complete purchase
4. Copy the phone number (e.g., `+233XXXXXXXXX`)
5. Add it to Supabase Phone Auth settings

## How It Works

### Phone Authentication Flow
1. User enters phone number on sign-in/sign-up page
2. Frontend calls `supabase.auth.signInWithOtp({ phone: formattedPhone })`
3. Supabase sends OTP via Twilio SMS
4. User receives SMS with verification code
5. User enters OTP code
6. Frontend calls `supabase.auth.verifyOtp({ phone, token: otp, type: "sms" })`
7. User is authenticated

### Code Implementation
The phone authentication is already implemented in:
- `app/signin/page.tsx` - Sign in with phone number
- `app/signup/page.tsx` - Sign up with phone number

## Testing

### Test Phone Numbers (Twilio Test Mode)
Twilio provides test phone numbers for development:
- **Test Number**: `+15005550006` (always succeeds)
- **Test Number**: `+15005550001` (always fails)

### Testing OTP Flow
1. Use a real phone number (your own for testing)
2. Enter phone number on sign-in/sign-up page
3. Click "Send OTP"
4. Check your phone for SMS with verification code
5. Enter the code to complete authentication

## Production Setup

When ready for production:

1. **Get Live Twilio Credentials**:
   - Go to [Twilio Console](https://console.twilio.com/)
   - Get your **Live Account SID** and **Auth Token**
   - Purchase a production phone number

2. **Update Supabase Configuration**:
   - Replace test credentials with live credentials
   - Use production phone number

3. **Update Environment Variables** (if needed):
   ```env
   TWILIO_ACCOUNT_SID=AC_live_...
   TWILIO_AUTH_TOKEN=your_live_auth_token
   ```

## Phone Number Formatting

The app automatically formats Ghana phone numbers:
- Input: `0244123456` → Formatted: `+233244123456`
- Input: `+233244123456` → Formatted: `+233244123456`
- Input: `233244123456` → Formatted: `+233244123456`

## Cost Considerations

- **Twilio Test Credentials**: Free for testing
- **Production SMS**: ~$0.0075 per SMS (varies by country)
- **Ghana SMS**: Check Twilio pricing for Ghana rates

## Troubleshooting

### OTP Not Received
1. Check Twilio credentials in Supabase dashboard
2. Verify phone number format is correct
3. Check Twilio console for SMS logs
4. Ensure phone number is verified in Twilio (for test accounts)

### "Failed to send OTP" Error
1. Verify Twilio credentials are correct
2. Check if phone number is in correct format
3. Ensure Twilio account has sufficient balance (for production)
4. Check Supabase logs for detailed error messages

### Supabase Phone Auth Not Working
1. Ensure Phone provider is enabled in Supabase
2. Verify Twilio is configured as SMS provider
3. Check that phone number is added to Supabase settings
4. Review Supabase authentication logs

## Support

- [Twilio Documentation](https://www.twilio.com/docs)
- [Supabase Phone Auth Docs](https://supabase.com/docs/guides/auth/phone-login)
- [Twilio Console](https://console.twilio.com/)


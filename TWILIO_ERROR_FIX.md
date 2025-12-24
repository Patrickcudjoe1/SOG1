# Fixing Twilio Error 20003 - Authentication Failed

## Error Details
**Error Code**: 20003  
**Message**: "Authenticate"  
**Meaning**: Twilio cannot verify your credentials

## Common Causes & Solutions

### 1. ✅ Verify Credentials in Twilio Console
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Account** → **Account Info**
3. Verify your credentials match:
   - **Account SID**: Should start with `AC` (e.g., `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token**: Click "View" to reveal (check your Twilio Console)

### 2. ✅ Check for Extra Spaces or Characters
**IMPORTANT**: Make sure there are NO spaces before or after the credentials in Supabase!

**In Supabase Dashboard:**
- Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` ✅ (no spaces)
- Account SID: ` ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ` ❌ (has spaces)

### 3. ✅ Verify Account Status
1. Go to [Twilio Console](https://console.twilio.com/)
2. Check if your account is:
   - ✅ **Active** (should be green)
   - ❌ **Suspended** (contact Twilio support)
   - ❌ **Trial** (may have limitations)

### 4. ✅ Check Twilio Account Type
- **Test Credentials**: For development/testing only
- **Live Credentials**: For production

Make sure you're using the correct type for your environment.

### 5. ✅ Verify Supabase Configuration

#### Step-by-Step Supabase Setup:

1. **Go to Supabase Dashboard**
   - [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Navigate to Phone Auth Settings**
   - Click **Authentication** (left sidebar)
   - Click **Settings** tab
   - Scroll to **Phone Auth** section

3. **Configure Twilio Provider**
   - **SMS Provider**: Select **Twilio**
   - **Twilio Account SID**: 
     ```
     ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
     ⚠️ **NO spaces before or after!** (Get from Twilio Console)
   
   - **Twilio Auth Token**: 
     ```
     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
     ⚠️ **NO spaces before or after!** (Get from Twilio Console)

4. **Add Twilio Phone Number**
   - Go to [Twilio Console](https://console.twilio.com/)
   - **Phone Numbers** → **Manage** → **Active Numbers**
   - If you don't have a number:
     - Click **Buy a number**
     - Select **Ghana** (or your country)
     - Complete purchase
   - Copy the phone number (format: `+1234567890`)
   - Paste in Supabase **From Phone Number** field

5. **Save Settings**
   - Click **Save** button
   - Wait for confirmation

### 6. ✅ Test Twilio Credentials Directly

You can test if your credentials work by making a test API call:

```bash
# Test with curl (replace with your credentials from Twilio Console)
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json \
  --data-urlencode "From=+1234567890" \
  --data-urlencode "To=+233244123456" \
  --data-urlencode "Body=Test message" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN
```

If this fails, your credentials are incorrect.

### 7. ✅ Check Twilio Account Limitations

**Trial Account Limitations:**
- Can only send SMS to verified phone numbers
- Limited number of messages
- May need to verify your account

**To Verify Phone Number in Twilio:**
1. Go to [Twilio Console](https://console.twilio.com/)
2. **Phone Numbers** → **Verified Caller IDs**
3. Add your phone number
4. Verify via SMS or call

### 8. ✅ Regenerate Auth Token (If Needed)

If credentials still don't work:

1. Go to [Twilio Console](https://console.twilio.com/)
2. **Account** → **API Keys & Tokens**
3. Click **Create API Key** or regenerate Auth Token
4. **Copy the new Auth Token immediately** (it won't be shown again!)
5. Update in Supabase with new token

## Quick Checklist

- [ ] Credentials copied correctly (no spaces)
- [ ] Account SID starts with `AC`
- [ ] Auth Token is correct (click "View" in Twilio to verify)
- [ ] Twilio account is active (not suspended)
- [ ] Phone number added in Supabase
- [ ] Settings saved in Supabase
- [ ] Phone Auth provider enabled in Supabase

## Still Not Working?

### Option 1: Use Supabase's Built-in SMS (No Twilio)
1. In Supabase Dashboard → **Authentication** → **Settings**
2. **Phone Auth** section
3. Select **MessageBird** or **Vonage** instead of Twilio
4. Configure with their credentials

### Option 2: Contact Support
- **Twilio Support**: [https://support.twilio.com](https://support.twilio.com)
- **Supabase Support**: [https://supabase.com/support](https://supabase.com/support)

## Test After Fixing

1. Go to your sign-in page
2. Enter a phone number
3. Click "Send OTP"
4. Check your phone for SMS
5. If you receive SMS, the fix worked! ✅

## Important Notes

- **Test Credentials**: The credentials you provided are test credentials. Make sure your Twilio account is in test mode or use live credentials for production.
- **Phone Number Format**: Always use E.164 format: `+233244123456` (country code + number)
- **Rate Limits**: Trial accounts have rate limits. Check Twilio console for usage.


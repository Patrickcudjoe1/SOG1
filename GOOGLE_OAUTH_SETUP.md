# Google OAuth Setup for Supabase

## Steps to Configure in Supabase

1. **Go to Supabase Dashboard**:
   - Navigate to: https://app.supabase.com/project/icafnnwviqkphxmcqbad/auth/providers

2. **Enable Google Provider**:
   - Find **Google** in the list of providers
   - Click **Enable**

3. **Add Your Credentials**:
   - **Client ID (Client ID)**: `YOUR_CLIENT_ID.apps.googleusercontent.com`
   - **Client Secret (Client Secret)**: `YOUR_CLIENT_SECRET`
   
   ⚠️ **Note**: The full string you provided appears to be a combination. You'll need:
   - **Client ID**: The part ending in `.apps.googleusercontent.com`
   - **Client Secret**: The part starting with `GOCSPX-`

4. **Get Full Credentials from Google Cloud Console**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Find your OAuth 2.0 Client ID
   - Copy the **Client ID** (should end in `.apps.googleusercontent.com`)
   - Copy the **Client Secret** (should start with `GOCSPX-`)

5. **Add Authorized Redirect URI in Google Cloud Console**:
   - In your Google OAuth credentials, add:
   - `https://icafnnwviqkphxmcqbad.supabase.co/auth/v1/callback`
   - This is Supabase's callback URL for OAuth

6. **Save in Supabase**:
   - Paste both Client ID and Client Secret
   - Click **Save**

## Testing

After configuration:
1. Go to `/signin` or `/signup`
2. Click the "Google" button
3. You should be redirected to Google for authentication
4. After approval, you'll be redirected back and signed in

## Troubleshooting

- **"Redirect URI mismatch"**: Make sure the redirect URI in Google Cloud Console matches exactly: `https://icafnnwviqkphxmcqbad.supabase.co/auth/v1/callback`
- **"Invalid client"**: Double-check your Client ID and Secret are correct
- **"Access blocked"**: Make sure your Google OAuth consent screen is configured


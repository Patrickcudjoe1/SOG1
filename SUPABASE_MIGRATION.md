# Supabase Migration Guide

This project has been migrated from NextAuth to Supabase Auth. Follow these steps to complete the setup.

## Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (already configured for Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:oA1N6oET0aTStvhn@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
```

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Auth Setup

### 1. Enable Email/Password Auth
- Go to **Authentication** → **Providers**
- Enable **Email** provider
- Configure email templates if needed

### 2. Enable OAuth Providers (Google)
- Go to **Authentication** → **Providers**
- Enable **Google** provider
- Add your Google OAuth credentials:
  - **Client ID** (from Google Cloud Console)
  - **Client Secret** (from Google Cloud Console)
- Add redirect URL: `https://your-domain.com/auth/callback`

### 3. Configure Redirect URLs
- Go to **Authentication** → **URL Configuration**
- Add your site URL: `http://localhost:3000` (development)
- Add production URL: `https://your-domain.com`
- Add callback URL: `https://your-domain.com/auth/callback`

## Database Schema

The Prisma schema has been migrated to PostgreSQL. Run:

```bash
npm run db:push
```

This will sync your schema with Supabase PostgreSQL.

## User Metadata

Supabase stores user metadata in `user_metadata`. The `name` field is stored there during signup. To access it:

```typescript
const user = await supabase.auth.getUser()
const name = user.data.user?.user_metadata?.name
```

## Migration Checklist

- [x] Install Supabase packages
- [x] Create Supabase client utilities
- [x] Update middleware
- [x] Update signin page
- [x] Update signup page
- [x] Update account pages
- [x] Update API middleware
- [x] Create OAuth callback route
- [ ] Add Supabase environment variables
- [ ] Configure Supabase Auth providers
- [ ] Test authentication flow
- [ ] Remove NextAuth dependencies (optional cleanup)

## Next Steps

1. **Add environment variables** to `.env.local` ✅ (Already done)
2. **Configure Supabase Auth** in the dashboard:
   - Enable Email provider
   - Enable Google OAuth (follow Google OAuth Setup section above)
3. **Test the authentication flow**:
   - Sign up with email/password
   - Sign in with email/password
   - Sign in with Google (if configured)
4. **Update user profiles** if needed to sync with Supabase user metadata

## Google OAuth Setup

To enable Google OAuth, you need to:

1. **Create a Google OAuth App**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `https://icafnnwviqkphxmcqbad.supabase.co/auth/v1/callback` (Supabase callback)
     - `http://localhost:3000/auth/callback` (for local development)
   - Copy the **Client ID** and **Client Secret**

2. **Configure in Supabase**:
   - Go to your Supabase project → **Authentication** → **Providers**
   - Enable **Google** provider
   - Paste your **Client ID** and **Client Secret**
   - Save

## Notes

- The `/api/auth/register` route is no longer needed (Supabase handles registration)
- User passwords are now managed by Supabase
- OAuth flows are handled by Supabase (Google provider configured)
- Session management is handled by Supabase (cookies)


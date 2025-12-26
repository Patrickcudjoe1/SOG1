# Setup Guide for SOG E-commerce Platform

## 🚀 Quick Start

### Prerequisites
- Node.js v20 or higher
- npm package manager
- A Firebase account (free tier works)
- A Paystack account (for payments)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Patrickcudjoe1/SOG1.git
   cd SOG1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```

4. **Configure Firebase**
   
   a. Go to [Firebase Console](https://console.firebase.google.com)
   
   b. Create a new project or use existing one
   
   c. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable Email/Password
      - Enable Google (optional)
   
   d. Enable Realtime Database:
      - Go to Realtime Database
      - Create database
      - Start in test mode (change rules later)
      - Copy the database URL
   
   e. Get your Firebase config:
      - Go to Project Settings > General
      - Scroll to "Your apps" section
      - Click "Web app" (</>) to get config
      - Copy all values to `.env.local`
   
   f. Get Firebase Admin SDK credentials:
      - Go to Project Settings > Service Accounts
      - Click "Generate new private key"
      - Download the JSON file
      - Copy `client_email` to `FIREBASE_CLIENT_EMAIL`
      - Copy `private_key` to `FIREBASE_PRIVATE_KEY`

5. **Configure Paystack**
   
   a. Go to [Paystack Dashboard](https://dashboard.paystack.com)
   
   b. Sign up or log in
   
   c. Get your API keys:
      - Go to Settings > API Keys & Webhooks
      - Copy Test Secret Key to `PAYSTACK_SECRET_KEY`
      - Copy Test Public Key to `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

6. **Generate JWT Secret**
   ```bash
   # Run this command and copy the output
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Paste the result into `JWT_SECRET` in `.env.local`

7. **Deploy Firebase Database Rules**
   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project
   firebase init
   # Select: Realtime Database
   # Use existing project: sog1-32845 (or your project)
   # Use database.rules.json as rules file
   
   # Deploy the rules
   firebase deploy --only database
   ```

8. **Run the development server**
   ```bash
   npm run dev
   ```

9. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Security Notes

- **NEVER** commit your `.env.local` file to git
- The `.env.local` file contains sensitive credentials
- Each team member should have their own `.env.local` file
- For production, use environment variables in your hosting platform (Vercel, etc.)

## 👥 For Team Members

If you're working on this project with others:

### Option 1: Use Your Own Firebase Project (Recommended)
- Each developer creates their own Firebase project
- Follow the setup steps above with your own credentials
- This is more secure and prevents conflicts

### Option 2: Share Credentials Privately (Not Recommended for Public Repos)
- The project owner shares the `.env.local` file privately (via Slack, email, etc.)
- **DO NOT** share credentials in public channels
- **DO NOT** commit credentials to git

## 🆘 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that your `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
- Make sure there are no extra spaces or quotes

### "JWT malformed" or authentication issues
- Verify your `JWT_SECRET` is at least 32 characters
- Make sure `FIREBASE_PRIVATE_KEY` includes the newline characters (`\n`)

### Database permission denied
- Deploy the Firebase Realtime Database rules using `firebase deploy --only database`
- Check that authentication is working

### Payment integration not working
- Verify your Paystack keys are correct
- Make sure you're using test keys for development
- Check that the callback URL is set correctly in Paystack dashboard

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Paystack API Reference](https://paystack.com/docs/api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Need help?** Open an issue on GitHub or contact the project maintainers.
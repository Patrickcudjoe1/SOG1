# Quick Database Setup

## 🚀 Fastest Option: Cloud Database (Recommended)

### Option A: Supabase (Free Tier - Easiest)

1. **Sign up**: Go to https://supabase.com and create a free account
2. **Create Project**: Click "New Project"
   - Name: `sog-backend`
   - Database Password: (save this!)
   - Region: Choose closest to you
3. **Get Connection String**:
   - Go to Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string
4. **Update .env**:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   Replace `[YOUR-PASSWORD]` with your database password
   Replace `[PROJECT-REF]` with your project reference

5. **Run Setup**:
   ```bash
   cd backend
   npm run db:setup
   ```

### Option B: Neon (Free Tier)

1. **Sign up**: Go to https://neon.tech and create a free account
2. **Create Project**: Click "Create Project"
   - Name: `sog-backend`
3. **Get Connection String**:
   - Copy the connection string from the dashboard
4. **Update .env**:
   ```env
   DATABASE_URL=[connection-string-from-neon]
   ```
5. **Run Setup**:
   ```bash
   cd backend
   npm run db:setup
   ```

## 🖥️ Local Setup (If you have PostgreSQL)

1. **Install PostgreSQL** (if not installed):
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Or use: `choco install postgresql`

2. **Create Database**:
   ```bash
   psql -U postgres
   CREATE DATABASE sog_db;
   \q
   ```

3. **Update .env**:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sog_db
   ```

4. **Run Setup**:
   ```bash
   cd backend
   npm run db:setup
   ```

## ✅ Verify Setup

After running `npm run db:setup`, you should see:
- ✅ Connected to PostgreSQL
- ✅ Database created (or already exists)
- ✅ Applied migrations
- ✅ Database setup complete!

## 📝 Next Steps

Once the database is set up:
1. Start the backend: `npm run backend:dev`
2. The server will test the connection on startup
3. You're ready to use the API!


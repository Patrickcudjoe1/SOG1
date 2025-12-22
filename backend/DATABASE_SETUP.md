# Database Setup Guide

This guide will help you set up the PostgreSQL database for the backend.

## Option 1: Local PostgreSQL Installation

### 1. Install PostgreSQL

**Windows:**
- Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Or use Chocolatey: `choco install postgresql`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sog_db;

# Create user (optional)
CREATE USER sog_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sog_db TO sog_user;

# Exit
\q
```

### 3. Update .env File

Update `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sog_db
```

### 4. Run Setup Script

```bash
cd backend
npm run db:setup
```

## Option 2: Cloud PostgreSQL (Recommended for Production)

### Using Supabase (Free Tier Available)

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI)
5. Update `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Using Neon (Free Tier Available)

1. Go to [Neon](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Update `backend/.env` with the connection string

### Using Railway

1. Go to [Railway](https://railway.app) and create an account
2. Create a new PostgreSQL database
3. Copy the connection string from the Variables tab
4. Update `backend/.env`

## Option 3: Docker (Quick Setup)

If you have Docker installed:

```bash
# Run PostgreSQL in Docker
docker run --name sog-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sog_db \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sog_db

# Run setup
cd backend
npm run db:setup
```

## Verify Setup

After running the setup script, verify the tables were created:

```bash
psql -U postgres -d sog_db

# List tables
\dt

# You should see:
# - admin
# - products  
# - store

# Exit
\q
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check if port 5432 is available
- Verify firewall settings

### Authentication Failed
- Double-check username and password in DATABASE_URL
- Ensure user has proper permissions

### Database Does Not Exist
- The setup script will try to create it automatically
- Or create manually: `CREATE DATABASE sog_db;`

## Manual Migration (Alternative)

If the setup script doesn't work, you can run migrations manually:

```bash
cd backend
npm run db:push
```

This uses Drizzle Kit to push the schema directly to the database.


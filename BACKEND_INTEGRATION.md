# Backend Integration Guide

This project now uses a separate Express.js backend server for API endpoints. The backend is located in the `backend/` directory.

## Architecture

- **Frontend**: Next.js application (port 3000)
- **Backend**: Express.js API server (port 4000)
- **Database**: PostgreSQL (via Drizzle ORM)

## Quick Start

### 1. Backend Setup

```bash
# Install backend dependencies
npm run backend:install

# Or manually:
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
DATABASE_URL=your_postgresql_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin
```

### 3. Database Setup

```bash
cd backend
npm run migrate
```

### 4. Running the Application

**Option 1: Run separately (recommended for development)**

Terminal 1 - Backend:
```bash
npm run backend:dev
# or
cd backend && npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Option 2: Use a process manager** (like `concurrently` or `pm2`)

## API Endpoints

The backend provides the following API routes:

- `/api/product` - Product management
  - `GET /api/product/list` - List all products
  - `GET /api/product/single/:id` - Get single product
  - `POST /api/product/add` - Add product (Admin only)
  - `POST /api/product/remove` - Remove product (Admin only)

- `/api/orders` - Order management
- `/api/paystack` - Payment processing
- `/api/admin` - Admin authentication

## Updating Frontend to Use Backend API

To use the backend API from your Next.js frontend, update your API calls to point to:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Example fetch
const response = await fetch(`${API_BASE_URL}/api/product/list`);
```

## Environment Variables for Frontend

Add to your root `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Notes

- The backend uses **PostgreSQL** with **Drizzle ORM**
- The frontend currently uses **MongoDB** with **Prisma** (for authentication)
- You may need to migrate data or run both databases depending on your needs
- The backend handles product management, orders, and payments
- The frontend handles authentication via NextAuth

## Troubleshooting

1. **CORS Errors**: Make sure `http://localhost:3000` is in the backend's allowed origins
2. **Port Conflicts**: Change the backend port in `backend/.env` if 4000 is taken
3. **Database Connection**: Ensure PostgreSQL is running and `DATABASE_URL` is correct


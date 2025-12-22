# Backend API Server

This is the Express.js backend server for the SOG1 e-commerce application.

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory with the following variables:
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

3. **Database Setup**
   - Ensure PostgreSQL is running
   - Run migrations:
     ```bash
     npm run migrate
     ```

4. **Start the Server**
   ```bash
   npm run server  # Development mode with nodemon
   # or
   npm start      # Production mode
   ```

## API Endpoints

- **Products**: `/api/product`
  - `GET /api/product/list` - List all products
  - `GET /api/product/single/:id` - Get single product
  - `POST /api/product/add` - Add product (Admin only)
  - `POST /api/product/remove` - Remove product (Admin only)

- **Orders**: `/api/orders`
  - Order management endpoints

- **Paystack**: `/api/paystack`
  - Payment processing endpoints

- **Admin**: `/api/admin`
  - Admin authentication and management

## Running with Next.js Frontend

The backend runs on port 4000 by default. The Next.js frontend (port 3000) should make API calls to `http://localhost:4000/api/...`

To run both servers simultaneously:
1. Terminal 1: `cd backend && npm run server`
2. Terminal 2: `npm run dev` (from project root)


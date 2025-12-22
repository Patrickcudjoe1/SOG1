# Admin Panel / CMS Guide

## Overview

The admin panel is a comprehensive Content Management System (CMS) for managing your e-commerce platform. It provides tools for managing orders, products, users, and viewing analytics.

## Access

The admin panel is accessible at `/admin` and requires admin authentication.

## Setting Up Your First Admin User

### Option 1: Using the Script (Recommended)

1. Create a TypeScript execution script or use `tsx`:

```bash
# Install tsx if not already installed
npm install -D tsx

# Run the script
npx tsx scripts/create-admin.ts admin@example.com yourpassword "Admin Name"
```

### Option 2: Manual Database Update

1. Create a regular user account through the signup page
2. Update the user's role in the database:

```javascript
// Using MongoDB directly or Prisma Studio
// Set role field to "ADMIN" or "SUPER_ADMIN"
```

### Option 3: Using Prisma Studio

```bash
npx prisma studio
```

1. Navigate to the `users` collection
2. Find your user
3. Update the `role` field to `ADMIN` or `SUPER_ADMIN`

## User Roles

### USER (Default)
- Regular customer access
- Can place orders, manage account

### ADMIN
- Access to admin panel
- Can manage orders, view users, view products
- Can update order statuses
- Cannot modify user roles (except own)

### SUPER_ADMIN
- All admin privileges
- Can modify user roles
- Can delete users
- Full system access

## Admin Panel Features

### 1. Dashboard (`/admin`)

**Overview Statistics:**
- Total Revenue
- Total Orders
- Total Users
- Today's Revenue
- Order Status Breakdown (Pending, Processing, Completed)

**Recent Orders:**
- Last 10 orders with customer info
- Quick status overview

**Top Products:**
- Best selling products
- Order count and quantity sold

### 2. Orders Management (`/admin/orders`)

**Features:**
- View all orders with pagination
- Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)
- Filter by payment status
- Search by order number or email
- Update order status inline
- View order details

**Actions:**
- Change order status via dropdown
- View full order details
- Track order progress

### 3. Products Management (`/admin/products`)

**Features:**
- View all products
- See product details (name, category, price, stock status)
- Quick actions (View, Edit, Delete)

**Note:** Full CRUD operations for products can be added as needed.

### 4. Users Management (`/admin/users`)

**Features:**
- View all users
- Search users by name or email
- View user statistics (order count, addresses)
- Update user roles (Super Admin only)
- Delete users (Super Admin only)

**Role Management:**
- Change user role between USER, ADMIN, SUPER_ADMIN
- Only Super Admins can modify roles

### 5. Analytics (`/admin/analytics`)

**Features:**
- Revenue overview
- Key metrics dashboard
- Top selling products
- Order statistics

**Note:** Chart visualizations can be added using libraries like Recharts or Chart.js.

## API Endpoints

### Admin Authentication

#### `GET /api/admin/check`
Check if current user is admin.

**Response:**
```json
{
  "success": true,
  "data": {
    "isAdmin": true,
    "isSuperAdmin": false,
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    }
  }
}
```

### Dashboard

#### `GET /api/admin/dashboard`
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 150,
      "totalOrders": 500,
      "totalRevenue": 50000.00,
      "pendingOrders": 10,
      "processingOrders": 5,
      "completedOrders": 450,
      "todayOrders": 5,
      "todayRevenue": 500.00
    },
    "recentOrders": [...],
    "topProducts": [...]
  }
}
```

### Orders

#### `GET /api/admin/orders`
Get all orders with filters.

**Query Parameters:**
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)
- `status` - Filter by order status
- `paymentStatus` - Filter by payment status
- `search` - Search by order number or email

#### `PATCH /api/admin/orders/[id]`
Update order status.

**Body:**
```json
{
  "status": "PROCESSING"
}
```

### Users

#### `GET /api/admin/users`
Get all users.

**Query Parameters:**
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)
- `search` - Search by name or email

#### `PATCH /api/admin/users/[id]`
Update user role (Super Admin only).

**Body:**
```json
{
  "role": "ADMIN"
}
```

#### `DELETE /api/admin/users/[id]`
Delete user (Super Admin only).

## Security

### Authentication
- All admin routes require authentication
- Admin layout checks admin status on mount
- Redirects non-admin users to homepage

### Authorization
- Admin middleware checks user role
- Super Admin operations are restricted
- API routes validate admin status

### Best Practices
1. **Never expose admin routes** - Keep admin panel URL private
2. **Use strong passwords** - For admin accounts
3. **Limit admin users** - Only grant admin access to trusted users
4. **Monitor admin activity** - Log admin actions (can be added)
5. **Regular audits** - Review admin user list periodically

## Customization

### Adding New Admin Pages

1. Create page in `/app/admin/[page-name]/page.tsx`
2. Add navigation link in `/app/admin/layout.tsx`
3. Create API routes in `/app/api/admin/[endpoint]/route.ts`
4. Use admin middleware for protection

### Styling

The admin panel uses:
- Tailwind CSS for styling
- Responsive design
- Clean, minimal interface

### Adding Features

**Product CRUD:**
- Create API routes for product management
- Add forms for creating/editing products
- Integrate with existing product service

**Advanced Analytics:**
- Add chart libraries (Recharts, Chart.js)
- Create custom reports
- Export data functionality

**Email Notifications:**
- Order status change notifications
- User role change notifications
- System alerts

## Troubleshooting

### Cannot Access Admin Panel

1. **Check user role:**
   - Ensure user has `ADMIN` or `SUPER_ADMIN` role
   - Use Prisma Studio to verify

2. **Check authentication:**
   - Ensure user is logged in
   - Check session validity

3. **Check API response:**
   - Open browser console
   - Check `/api/admin/check` response

### Admin Check Failing

1. **Verify database:**
   - Check if User model has `role` field
   - Run `npx prisma db push` if needed

2. **Check middleware:**
   - Verify admin middleware is working
   - Check server logs for errors

### Permission Denied

- Super Admin operations require `SUPER_ADMIN` role
- Regular admins cannot modify user roles
- Check user role before attempting operations

## Future Enhancements

- [ ] Product CRUD operations
- [ ] Inventory management
- [ ] Advanced analytics with charts
- [ ] Email notification system
- [ ] Activity logging
- [ ] Export functionality (CSV, PDF)
- [ ] Bulk operations
- [ ] Advanced search and filters
- [ ] Custom reports builder
- [ ] Multi-language support

## Support

For issues or questions:
1. Check user role in database
2. Verify authentication status
3. Review API responses in browser console
4. Check server logs for errors


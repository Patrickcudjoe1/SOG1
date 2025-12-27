// Admin-specific types

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type ChartPeriod = "7d" | "30d" | "90d" | "1y";

export interface DashboardKPI {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedPayments: number;
  todayOrders: number;
  todayRevenue: number;
  processingOrders: number;
  completedOrders: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date | string;
}

export interface TopProduct {
  productId: string;
  productName: string;
  orderCount: number;
  totalQuantity: number;
  revenue?: number;
}

export interface ChartDataPoint {
  date: string;
  revenue?: number;
  orders?: number;
  label?: string;
  value?: number;
}

export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  image?: string;
}
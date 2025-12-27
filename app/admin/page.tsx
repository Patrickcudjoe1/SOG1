"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatCurrency } from "@/app/lib/currency"
import { KPICard } from "./components/KPICard"
import { StatusBadge } from "./components/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DollarSign, ShoppingCart, Clock, CheckCircle2, TrendingUp, Package, BarChart3 } from "lucide-react"
import { formatDate } from "@/app/lib/admin/formatters"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

interface DashboardStats {
  overview: {
    totalUsers: number
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    processingOrders: number
    completedOrders: number
    todayOrders: number
    todayRevenue: number
  }
  recentOrders: any[]
  topProducts: any[]
  chartData?: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true;
    
    fetchDashboard(isMounted)
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboard(isMounted, true)
    }, 30000)
    
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const fetchDashboard = async (isMounted: boolean, silent = false) => {
    if (!silent) {
      setRefreshing(true)
    }
    
    const timestamp = Date.now()
    fetch(`/api/admin/dashboard?_t=${timestamp}`, { 
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setStats(data.data)
          setLastUpdated(new Date())
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Dashboard fetch error:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
          setRefreshing(false)
        }
      });
  }

  const handleManualRefresh = () => {
    let isMounted = true
    fetchDashboard(isMounted, false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  const { overview, recentOrders, topProducts } = stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your e-commerce platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="px-4 py-2 text-sm border border-border hover:bg-muted transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(overview.totalRevenue)}
          icon={DollarSign}
          description={`${formatCurrency(overview.todayRevenue)} today`}
        />
        <KPICard
          title="Total Orders"
          value={overview.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          description={`${overview.todayOrders} today`}
        />
        <KPICard
          title="Pending Orders"
          value={overview.pendingOrders}
          icon={Clock}
          description="Awaiting processing"
        />
        <KPICard
          title="Completed"
          value={overview.completedOrders}
          icon={CheckCircle2}
          description="Successfully delivered"
        />
      </div>

      {/* Quick Revenue Chart */}
      {stats.chartData && stats.chartData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </div>
              <Link 
                href="/admin/analytics"
                className="text-sm text-primary hover:underline"
              >
                View detailed analytics
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px] w-full"
            >
              <BarChart
                data={stats.chartData.slice(-7)}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `₵${value}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from customers</CardDescription>
              </div>
              <Link 
                href="/admin/orders"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{order.user?.name || "Guest"}</p>
                        <p className="text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} type="order" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {recentOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.productName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-3 w-3" />
                      <span>{product.totalQuantity} sold</span>
                      <span>•</span>
                      <span>{product.orderCount} orders</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
              ))}
            </div>
            {topProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No sales data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


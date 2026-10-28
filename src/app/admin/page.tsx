'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
  AlertTriangle,
  Receipt,
  CalendarDays,
  ArrowRight,
  Boxes,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { orders, tables, reservations, inventory, menuItems } = useTableflow();

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('Wednesday, 28 October 2026');

  useEffect(() => {
    try {
      const now = new Date();
      setCurrentDateFormatted(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    } catch (e) {
      // Fallback
    }
  }, []);

  // Compute live metrics from actual orders
  const metrics = useMemo(() => {
    let relevantOrders = orders.filter((o) => o.status !== 'cancelled');

    const now = new Date();
    if (dateRange === 'today') {
      const todayStr = now.toISOString().slice(0, 10);
      relevantOrders = relevantOrders.filter((o) => o.createdAt.startsWith(todayStr));
    } else if (dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      relevantOrders = relevantOrders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo);
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      relevantOrders = relevantOrders.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo);
    }

    const grossSales = relevantOrders.reduce(
      (sum, o) => sum + o.subtotal + o.packagingCharge + o.deliveryFee,
      0
    );
    const totalDiscounts = relevantOrders.reduce((sum, o) => sum + o.discountAmount, 0);
    const netSales = Math.max(0, grossSales - totalDiscounts);

    const paidOrders = relevantOrders.filter((o) => o.paymentStatus === 'paid');
    const paidRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersList = relevantOrders.filter(
      (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready'
    );
    const unpaidOrdersList = relevantOrders.filter((o) => o.paymentStatus !== 'paid');

    const orderCount = relevantOrders.length;
    const aov = orderCount > 0 ? (grossSales - totalDiscounts) / orderCount : 0;

    // Low stock items
    const lowStockItems = inventory.filter((i) => i.currentStock <= i.minThreshold);

    return {
      netSales,
      orderCount,
      aov,
      pendingOrdersCount: pendingOrdersList.length,
      unpaidOutstanding: unpaidOrdersList.reduce((sum, o) => sum + o.total, 0),
      lowStockItems,
      relevantOrders,
    };
  }, [orders, inventory, dateRange]);

  // Compute 7-day sales trend for chart
  const salesTrend = useMemo(() => {
    const days: { label: string; dateStr: string; amount: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayTotal = orders
        .filter((o) => o.status !== 'cancelled' && o.createdAt.startsWith(dateStr))
        .reduce((sum, o) => sum + o.total, 0);

      days.push({ label, dateStr, amount: dayTotal });
    }

    const maxVal = Math.max(1, ...days.map((d) => d.amount));
    return { days, maxVal };
  }, [orders]);

  // Top-selling dishes from order items
  const popularDishes = useMemo(() => {
    const counts: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const ord of orders) {
      if (ord.status === 'cancelled') continue;
      for (const item of ord.items) {
        if (!counts[item.name]) {
          counts[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        counts[item.name].quantity += item.quantity;
        counts[item.name].revenue += item.price * item.quantity;
      }
    }
    return Object.values(counts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  // Upcoming reservations
  const upcomingReservations = useMemo(() => {
    return reservations
      .filter((r) => r.status === 'confirmed' || r.status === 'seated')
      .slice(0, 5);
  }, [reservations]);

  return (
    <AdminLayout>
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentDateFormatted} &bull; Operational status: <span className="text-emerald-700 font-semibold">Active</span>
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-200/80 rounded-md text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded transition-colors ${
              dateRange === 'today' ? 'bg-white text-gray-900 font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('7days')}
            className={`px-3 py-1.5 rounded transition-colors ${
              dateRange === '7days' ? 'bg-white text-gray-900 font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('30days')}
            className={`px-3 py-1.5 rounded transition-colors ${
              dateRange === '30days' ? 'bg-white text-gray-900 font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              dateRange === 'all' ? 'bg-white text-gray-900 font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* FOUR COMPACT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Sales */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 tabular-nums">
            ₹{metrics.netSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Net sales after coupon discounts
          </p>
        </div>

        {/* Orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Orders Completed</span>
            <ShoppingBag className="w-4 h-4 text-[#702B2B]" />
          </div>
          <div className="text-2xl font-bold text-gray-900 tabular-nums">
            {metrics.orderCount}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Dine-in, takeaway and delivery
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Average Order Value</span>
            <CreditCard className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 tabular-nums">
            ₹{metrics.aov.toFixed(0)}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Average ticket size per order
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Active / Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 tabular-nums">
            {metrics.pendingOrdersCount}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            In kitchen or pending service
          </p>
        </div>
      </div>

      {/* SALES TREND & POPULAR ITEMS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Sales Trend Chart (7 Days) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Daily Sales Trend (Last 7 Days)
              </h2>
              <p className="text-xs text-gray-500">
                {orders.length === 0 ? 'No sales recorded for this period.' : 'Calculated from actual settled order totals'}
              </p>
            </div>
            <Link href="/admin/reports" className="text-xs text-[#702B2B] hover:underline font-medium">
              View Detailed P&amp;L
            </Link>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between gap-3 h-44 border-b border-gray-200 pb-2">
              {salesTrend.days.map((day) => {
                const heightPercent = Math.max(6, Math.round((day.amount / salesTrend.maxVal) * 100));
                return (
                  <div key={day.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                      ₹{day.amount > 0 ? (day.amount / 1000).toFixed(1) + 'k' : '0'}
                    </div>
                    <div
                      className="w-full max-w-[36px] bg-[#702B2B] hover:bg-[#5A2222] rounded-t transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] text-gray-600 mt-2 font-medium">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Menu Items */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Popular Menu Items
              </h2>
              <Link href="/admin/menu" className="text-xs text-[#702B2B] hover:underline font-medium">
                Menu
              </Link>
            </div>

            {popularDishes.length === 0 ? (
              <p className="text-xs text-gray-500 py-8 text-center">
                No orders recorded yet. Popular dishes will rank here as orders are fulfilled.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {popularDishes.map((dish, i) => (
                  <div key={dish.name} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium text-gray-900 block">{dish.name}</span>
                        <span className="text-[11px] text-gray-500">{dish.quantity} orders</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      ₹{dish.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="text-xs text-gray-500">Live transactions across all dining channels</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-[#702B2B] hover:underline font-medium">
            View All Orders ({orders.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase font-medium text-[10px]">
              <tr>
                <th className="py-2 px-3">Order #</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Items</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Order Status</th>
                <th className="py-2 px-3">Payment</th>
                <th className="py-2 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-gray-500">
                    No orders recorded yet. Fresh orders placed by guests or staff will appear here.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 6).map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">
                      <Link href={`/staff/orders/${ord.id}`} className="hover:underline">
                        #{ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-gray-800">
                      {ord.customerName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {ord.tableNumber ? `Table ${ord.tableNumber}` : ord.type}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {ord.items.length} {ord.items.length === 1 ? 'dish' : 'dishes'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900 tabular-nums">
                      ₹{ord.total.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          ord.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-500 font-mono text-[11px]">
                      {new Date(ord.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO COLUMN ROW: LOW STOCK & UPCOMING RESERVATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-gray-900">
                Low-Stock Alerts ({metrics.lowStockItems.length})
              </h2>
            </div>
            <Link href="/admin/inventory" className="text-xs text-[#702B2B] hover:underline font-medium">
              Manage Inventory
            </Link>
          </div>

          {metrics.lowStockItems.length === 0 ? (
            <p className="text-xs text-gray-500 py-3">All ingredients are above reorder threshold.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {metrics.lowStockItems.map((ing) => (
                <div key={ing.id} className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-amber-900 flex justify-between items-center">
                  <div>
                    <span className="font-semibold block">{ing.name}</span>
                    <span className="text-[11px] text-amber-700">
                      Threshold: {ing.minThreshold} {ing.unit} &bull; Supplier: {ing.supplierName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-amber-900 tabular-nums">
                      {ing.currentStock} {ing.unit}
                    </span>
                    <span className="text-[10px] text-red-700 block font-semibold">Low</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reservations */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-gray-700" />
              <h2 className="text-sm font-semibold text-gray-900">
                Upcoming Reservations
              </h2>
            </div>
            <Link href="/admin/reservations" className="text-xs text-[#702B2B] hover:underline font-medium">
              Reservations
            </Link>
          </div>

          {upcomingReservations.length === 0 ? (
            <p className="text-xs text-gray-500 py-3">No active reservations pending for today.</p>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {upcomingReservations.map((res) => (
                <div key={res.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900 block">{res.customerName}</span>
                    <span className="text-[11px] text-gray-500">
                      {res.guestCount} guests &bull; {res.timeSlot} &bull; Ref: #{res.referenceCode}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      res.status === 'seated'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

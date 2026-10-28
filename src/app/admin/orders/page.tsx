'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Order } from '@/types';
import { Search, Printer } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useTableflow();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (typeFilter !== 'all' && o.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchTable = o.tableNumber?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchTable) return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            View, filter, and manage all customer dining and online orders
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, or table..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium text-gray-700"
          >
            <option value="all">All Channels</option>
            <option value="dine_in">Dine-In</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Channel / Table</th>
              <th className="p-3.5">Dishes</th>
              <th className="p-3.5">Total & Payment</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5">
                  <span className="font-semibold text-gray-900">
                    #{ord.orderNumber}
                  </span>
                  <div className="text-[11px] text-gray-500">
                    {new Date(ord.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="font-medium text-gray-900">{ord.customerName}</div>
                  <div className="text-[11px] text-gray-500">{ord.customerPhone}</div>
                </td>

                <td className="p-3.5">
                  <span className="capitalize text-gray-700">
                    {ord.type.replace('_', ' ')}
                  </span>
                  {ord.tableNumber && (
                    <span className="text-[11px] text-[#702B2B] block font-medium">
                      Table {ord.tableNumber}
                    </span>
                  )}
                </td>

                <td className="p-3.5 max-w-xs">
                  <div className="line-clamp-2 text-gray-600">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="font-semibold text-gray-900">₹{ord.total.toFixed(2)}</div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${
                      ord.paymentStatus === 'paid'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ord.paymentStatus}
                  </span>
                </td>

                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      ord.status === 'completed'
                        ? 'bg-gray-100 text-gray-700 border border-gray-200'
                        : ord.status === 'ready'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : ord.status === 'preparing'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : ord.status === 'cancelled'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ord.status}
                  </span>
                </td>

                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => setSelectedReceiptOrder(ord)}
                    className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>

                  {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'completed', 'Aditi (Admin)', 'Completed via Admin')}
                      className="px-2 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          isOpen={!!selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </AdminLayout>
  );
}

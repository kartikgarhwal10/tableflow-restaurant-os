'use client';

import React, { useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';

export default function AdminCustomersPage() {
  const { orders } = useTableflow();

  // Aggregate customers from orders
  const customerList = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email?: string; totalSpend: number; orderCount: number; lastOrder: string }>();

    for (const ord of orders) {
      if (!ord.customerName) continue;
      const key = ord.customerPhone || ord.customerName;
      const existing = map.get(key);
      if (existing) {
        existing.totalSpend += ord.total;
        existing.orderCount += 1;
        if (new Date(ord.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = ord.createdAt;
        }
      } else {
        map.set(key, {
          name: ord.customerName,
          phone: ord.customerPhone,
          email: ord.customerEmail,
          totalSpend: ord.total,
          orderCount: 1,
          lastOrder: ord.createdAt,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Customers
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Customer directory and lifetime spending summary
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Customer Name</th>
              <th className="p-3.5">Phone</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Orders</th>
              <th className="p-3.5">Total Spend</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customerList.map((cust) => {
              const isVIP = cust.totalSpend > 4000;

              return (
                <tr key={cust.phone || cust.name} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 font-medium text-gray-900">
                    {cust.name}
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {cust.phone}
                  </td>
                  <td className="p-3.5 text-gray-500">
                    {cust.email || '—'}
                  </td>
                  <td className="p-3.5 text-gray-700">
                    {cust.orderCount} {cust.orderCount === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="p-3.5 font-semibold text-gray-900">
                    ₹{cust.totalSpend.toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        isVIP
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {isVIP ? 'VIP Guest' : 'Regular'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {customerList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-gray-500">
                  No customer orders recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

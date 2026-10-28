'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Search } from 'lucide-react';

export default function AdminReservationsPage() {
  const { reservations, updateReservationStatus } = useTableflow();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = reservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRef = r.referenceCode.toLowerCase().includes(q);
      const matchName = r.customerName.toLowerCase().includes(q);
      if (!matchRef && !matchName) return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Reservations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage table bookings, guest arrivals, and seating assignments
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference # or customer name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
          />
        </div>

        <div className="text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Ref Code</th>
              <th className="p-3.5">Customer & Phone</th>
              <th className="p-3.5">Date & Time</th>
              <th className="p-3.5">Guests & Section</th>
              <th className="p-3.5">Special Requests</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5 font-semibold text-gray-900">
                  #{res.referenceCode}
                </td>
                <td className="p-3.5">
                  <div className="font-medium text-gray-900">{res.customerName}</div>
                  <div className="text-[11px] text-gray-500">{res.customerPhone}</div>
                </td>
                <td className="p-3.5">
                  <div className="text-gray-900">{res.date}</div>
                  <div className="text-[11px] text-gray-500">{res.timeSlot}</div>
                </td>
                <td className="p-3.5">
                  <div className="text-gray-900">{res.guestCount} Guests</div>
                  <span className="text-[11px] text-gray-500 capitalize">
                    {res.section} (Table {res.tableNumber || 'Auto'})
                  </span>
                </td>
                <td className="p-3.5 max-w-xs text-gray-600 text-xs">
                  {res.specialRequests || res.occasion || 'None'}
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      res.status === 'confirmed'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : res.status === 'seated'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'seated', res.tableId)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Seat Party
                    </button>
                  )}
                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'cancelled')}
                      className="px-2.5 py-1 text-red-700 hover:text-red-800 border border-red-300 rounded text-[11px] font-medium hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

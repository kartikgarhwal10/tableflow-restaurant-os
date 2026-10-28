'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { TableStatus } from '@/types';

export default function AdminTablesPage() {
  const { tables, updateTableStatus } = useTableflow();

  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    updateTableStatus(tableId, newStatus);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Tables
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage restaurant dining areas, seat capacity, and live table status
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Table No</th>
              <th className="p-3.5">Table Name & Section</th>
              <th className="p-3.5">Capacity</th>
              <th className="p-3.5">Current Status</th>
              <th className="p-3.5">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tables.map((tbl) => (
              <tr key={tbl.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5 font-semibold text-gray-900">
                  {tbl.number}
                </td>
                <td className="p-3.5">
                  <div className="font-medium text-gray-900">{tbl.name}</div>
                  <span className="text-[11px] capitalize text-gray-500">
                    {tbl.section}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="text-gray-700">{tbl.capacity} Guests</span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      tbl.status === 'available'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : tbl.status === 'seated'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : tbl.status === 'bill_requested'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : tbl.status === 'reserved'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {tbl.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5">
                  <select
                    value={tbl.status}
                    onChange={(e) => handleStatusChange(tbl.id, e.target.value as TableStatus)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-800 font-medium"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="seated">Seated</option>
                    <option value="bill_requested">Bill Requested</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

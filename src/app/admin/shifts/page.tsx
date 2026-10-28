'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';

export default function AdminShiftsPage() {
  const { shifts } = useTableflow();

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Staff Shifts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Shift schedules, timings, and floor coverage
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Staff Name & Role</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Hours</th>
              <th className="p-3.5">Station / Notes</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shifts.map((sh) => (
              <tr key={sh.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5 font-medium text-gray-900">
                  {sh.staffName}
                  <span className="text-[11px] font-normal capitalize text-gray-500 block">
                    {sh.role}
                  </span>
                </td>
                <td className="p-3.5 text-gray-700">
                  {sh.date}
                </td>
                <td className="p-3.5 text-gray-800">
                  {sh.startTime} &mdash; {sh.endTime}
                </td>
                <td className="p-3.5 text-gray-600">
                  {sh.notes || 'General coverage'}
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      sh.status === 'active'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {sh.status}
                  </span>
                </td>
              </tr>
            ))}
            {shifts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-gray-500">
                  No active shifts scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

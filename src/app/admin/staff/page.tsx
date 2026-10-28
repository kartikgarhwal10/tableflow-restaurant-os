'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';

export default function AdminStaffPage() {
  const { staff } = useTableflow();

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Staff
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Team directory, assigned roles, and PIN access
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-gray-200 p-5 rounded space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200 bg-gray-100"
                />
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {member.name}
                  </h2>
                  <span className="text-[11px] uppercase font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {member.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="truncate">{member.email}</div>
                <div>{member.phone}</div>
                <div className="text-gray-500 text-[11px] mt-1 capitalize">
                  Shift: {member.shift}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">PIN: {member.pin}</span>
              <span className="text-green-700 bg-green-50 border border-green-200 text-[11px] px-2 py-0.5 rounded font-medium">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

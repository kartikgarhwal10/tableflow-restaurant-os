'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Truck } from 'lucide-react';

export default function AdminSuppliersPage() {
  const { suppliers } = useTableflow();

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Suppliers
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Vendor contacts and ingredient supply partners
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white border border-gray-200 p-5 rounded space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-medium text-gray-500 capitalize block">
                  {sup.categories.join(', ')}
                </span>
                <h2 className="text-base font-semibold text-gray-900">
                  {sup.name}
                </h2>
              </div>
              <div className="w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-24">Contact:</span>
                <span className="font-medium text-gray-900">{sup.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-24">Phone:</span>
                <span>{sup.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-24">Email:</span>
                <span>{sup.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500 w-24 shrink-0">Address:</span>
                <span className="text-gray-600">{sup.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AVAILABLE_COUPONS } from '@/lib/constants';

export default function AdminMarketingPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Marketing & Offers
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Active promotion codes, discounts, and order thresholds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AVAILABLE_COUPONS.map((cpn) => (
          <div
            key={cpn.code}
            className="bg-white border border-gray-200 p-5 rounded space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                {cpn.code}
              </span>
              <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                Active
              </span>
            </div>

            <p className="text-xs text-gray-600">
              {cpn.description}
            </p>

            <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-medium text-gray-900">{cpn.discountType === 'percentage' ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Order:</span>
                <span className="font-medium text-gray-900">₹{cpn.minOrder}</span>
              </div>
              {cpn.maxDiscount && (
                <div className="flex justify-between">
                  <span>Max Discount:</span>
                  <span className="font-medium text-gray-900">₹{cpn.maxDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <span className="text-gray-500">{cpn.validUntil}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

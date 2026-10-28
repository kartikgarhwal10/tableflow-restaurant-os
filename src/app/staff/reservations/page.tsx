'use client';

import React from 'react';
import StaffLayout from '@/components/staff/StaffLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { CheckCircle2 } from 'lucide-react';

export default function StaffReservationsPage() {
  const { reservations, updateReservationStatus } = useTableflow();

  const handleSeatParty = (resId: string, tableId?: string) => {
    updateReservationStatus(resId, 'seated', tableId);
  };

  return (
    <StaffLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Floor Reservations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage guest arrivals and table assignments
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100">
        {reservations.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No table reservations scheduled for today.
          </div>
        ) : (
          reservations.map((res) => {
            const isConfirmed = res.status === 'confirmed';
            const isSeated = res.status === 'seated';

            return (
              <div key={res.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold text-gray-900">
                    #{res.referenceCode}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {res.customerName}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded font-medium capitalize ${
                      isSeated
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isConfirmed
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600">
                  Date: <span className="font-medium text-gray-900">{res.date}</span> at <span className="font-medium text-gray-900">{res.timeSlot}</span> &bull; Party Size: <span className="font-medium text-gray-900">{res.guestCount} Guests</span> &bull;{' '}
                  <span className="capitalize font-medium text-[#702B2B]">{res.section} (Table {res.tableNumber || 'Auto'})</span>
                </p>

                <p className="text-xs text-gray-500">
                  Contact: {res.customerPhone} &bull; {res.customerEmail}
                </p>

                {res.specialRequests && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                    <span className="font-medium">Special Request:</span> {res.specialRequests}
                  </p>
                )}
              </div>

              <div>
                {isConfirmed && (
                  <button
                    onClick={() => handleSeatParty(res.id, res.tableId)}
                    className="px-4 py-2 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Seat at Table {res.tableNumber || ''}
                  </button>
                )}

                {isSeated && (
                  <span className="text-xs text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded border border-blue-200 inline-block">
                    Seated at Table {res.tableNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
      </div>
    </StaffLayout>
  );
}

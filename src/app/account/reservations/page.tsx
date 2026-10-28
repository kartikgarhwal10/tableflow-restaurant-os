'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import { ArrowLeft, CalendarDays } from 'lucide-react';

export default function AccountReservationsPage() {
  const { reservations, updateReservationStatus } = useTableflow();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#702B2B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            Table Reservations
          </h1>
          <Link
            href="/reservations"
            className="px-4 py-2 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded transition-colors"
          >
            + New Reservation
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100">
          {reservations.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No table reservations found.{' '}
              <Link href="/reservations" className="text-[#702B2B] font-medium underline">
                Book a table
              </Link>{' '}
              for dining.
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      Booking #{res.referenceCode}
                    </h3>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded font-medium capitalize ${
                        res.status === 'confirmed'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : res.status === 'seated'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600">
                    {res.date} at {res.timeSlot} &bull; {res.guestCount} Guests &bull;{' '}
                    <span className="capitalize font-medium text-gray-900">{res.section} (Table {res.tableNumber || 'Assigned on arrival'})</span>
                  </p>

                  {res.occasion && (
                    <p className="text-xs text-gray-500 mt-1">
                      Occasion: {res.occasion}
                    </p>
                  )}
                  {res.specialRequests && (
                    <p className="text-xs text-gray-500 italic mt-0.5">
                      Note: {res.specialRequests}
                    </p>
                  )}
                </div>

                {res.status === 'confirmed' && (
                  <div>
                    <button
                      onClick={() => updateReservationStatus(res.id, 'cancelled')}
                      className="px-3 py-1.5 text-xs text-red-700 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 font-medium transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

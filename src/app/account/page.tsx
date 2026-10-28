'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  ShoppingBag,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';

export default function AccountPage() {
  const { orders, reservations } = useTableflow();

  const guestOrders = orders.slice(0, 5);
  const guestReservations = reservations.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-[#702B2B] text-white flex items-center justify-center text-xl font-semibold">
            AS
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs font-medium text-gray-500 block mb-1">
              Customer Account
            </span>
            <h1 className="text-2xl font-semibold text-gray-900">
              Aniruddh Shekhawat
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              +91 98290 12345 &bull; aniruddh@jaipurguest.com &bull; Jaipur, Rajasthan
            </p>
            <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium border border-gray-200">
                Regular Guest
              </span>
              <span className="text-xs text-gray-500">
                Customer ID: CUST-8821
              </span>
            </div>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Recent Orders Box */}
          <div className="bg-white border border-gray-200 p-6 rounded space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#702B2B]" />
                <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <Link
                href="/account/orders"
                className="text-xs text-[#702B2B] hover:underline font-medium"
              >
                View All
              </Link>
            </div>

            {guestOrders.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">No recent orders.</p>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {guestOrders.map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">#{ord.orderNumber}</span>
                        <span className="text-[11px] text-gray-500 capitalize">
                          ({ord.type.replace('_', ' ')})
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} &bull; ₹{ord.total.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                          ord.status === 'ready' || ord.status === 'served' || ord.status === 'completed'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <Link
                        href={`/order/${ord.id}`}
                        className="p-1 text-gray-400 hover:text-gray-700"
                        title="Track Order"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Reservations Box */}
          <div className="bg-white border border-gray-200 p-6 rounded space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#702B2B]" />
                <h2 className="text-base font-semibold text-gray-900">Table Reservations</h2>
              </div>
              <Link
                href="/account/reservations"
                className="text-xs text-[#702B2B] hover:underline font-medium"
              >
                View All
              </Link>
            </div>

            {guestReservations.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">No upcoming reservations.</p>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {guestReservations.map((res) => (
                  <div key={res.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">#{res.referenceCode}</span>
                        <span className="capitalize text-gray-600 font-normal">
                          ({res.section})
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        {res.date} at {res.timeSlot} &bull; {res.guestCount} Guests
                      </div>
                    </div>

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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

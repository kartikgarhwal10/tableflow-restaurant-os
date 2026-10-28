'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Order } from '@/types';
import { ArrowLeft, Printer, ExternalLink } from 'lucide-react';

export default function AccountOrdersPage() {
  const { orders } = useTableflow();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

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

        <h1 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
          Order History
        </h1>

        <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No past orders found.{' '}
              <Link href="/menu" className="text-[#702B2B] font-medium underline">
                Explore our menu
              </Link>{' '}
              to place an order.
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    Order #{ord.orderNumber}
                  </h3>
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded capitalize font-medium border border-gray-200">
                    {ord.type.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-medium capitalize ${
                      ord.paymentStatus === 'paid'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ord.paymentStatus}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  {new Date(ord.createdAt).toLocaleDateString('en-IN')} at{' '}
                  {new Date(ord.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}{' '}
                  &bull; {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} &bull; Total: <span className="font-semibold text-gray-900">₹{ord.total.toFixed(2)}</span>
                </p>

                <div className="text-xs text-gray-700 mt-2">
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedReceiptOrder(ord)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Invoice
                </button>

                <Link
                  href={`/order/${ord.id}`}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#702B2B] hover:bg-[#592222] rounded flex items-center gap-1.5 transition-colors"
                >
                  Track Status
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
        </div>
      </main>

      <Footer />

      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          isOpen={!!selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
}

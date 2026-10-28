'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StaffLayout from '@/components/staff/StaffLayout';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import { ArrowLeft, Printer } from 'lucide-react';

export default function StaffOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { orders, updateOrderStatus } = useTableflow();

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <StaffLayout>
        <div className="py-12 text-center text-gray-500 text-sm">
          Order not found.
          <Link href="/staff/orders" className="text-[#702B2B] ml-2 font-medium hover:underline">
            Back to Orders
          </Link>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <Link
        href="/staff/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#702B2B] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="bg-white border border-gray-200 p-6 rounded mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-gray-500 font-medium block">
            Order Summary
          </span>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Customer: <span className="font-medium text-gray-900">{order.customerName}</span> ({order.customerPhone}) &bull;{' '}
            <span className="capitalize">{order.type.replace('_', ' ')}</span>
            {order.tableNumber && ` &bull; Table ${order.tableNumber}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'ready' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'served', 'Ravi Kumar (Staff)')}
              className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
            >
              Mark as Served
            </button>
          )}

          <button
            onClick={() => setIsReceiptOpen(true)}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Bill
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white border border-gray-200 p-6 rounded space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Items in Order ({order.items.length})
          </h2>

          <div className="divide-y divide-gray-100 text-xs">
            {order.items.map((i) => (
              <div key={i.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">{i.quantity}x {i.name}</div>
                  <span className="text-[11px] text-gray-500 block">Station: {i.station}</span>
                  {i.specialInstructions && (
                    <span className="text-[11px] text-gray-500 italic block mt-0.5">&bull; {i.specialInstructions}</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">₹{(i.price * i.quantity).toFixed(2)}</div>
                  <span className="text-[10px] capitalize font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                    {i.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-white border border-gray-200 p-6 rounded space-y-3 text-xs">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Bill Breakdown
          </h2>
          <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span></div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-700"><span>Discount:</span><span>-₹{order.discountAmount.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between text-gray-600"><span>CGST (2.5%):</span><span className="text-gray-900">₹{order.cgst.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>SGST (2.5%):</span><span className="text-gray-900">₹{order.sgst.toFixed(2)}</span></div>
          <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-sm text-gray-900">
            <span>Total:</span>
            <span className="text-base font-bold text-[#702B2B]">₹{order.total.toFixed(2)}</span>
          </div>
          <div className="pt-2 text-gray-500 text-[11px]">
            Payment Status: <span className="capitalize font-medium text-gray-900">{order.paymentStatus}</span>
          </div>
        </div>
      </div>

      <ReceiptModal
        order={order}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </StaffLayout>
  );
}

'use client';

import React, { useState } from 'react';
import StaffLayout from '@/components/staff/StaffLayout';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Order, PaymentMethod } from '@/types';
import {
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
} from 'lucide-react';

export default function StaffBillingPage() {
  const { tables, orders, settlePayment } = useTableflow();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);
  const [settledSuccessOrder, setSettledSuccessOrder] = useState<string | null>(null);

  // Find all unpaid orders
  const unpaidOrders = orders.filter((o) => o.paymentStatus !== 'paid' && o.status !== 'cancelled');

  const handleSettle = (order: Order) => {
    settlePayment(order.id, paymentMethod);
    setReceiptModalOrder(order);
    setSettledSuccessOrder(order.id);
    setSelectedOrder(null);
  };

  return (
    <StaffLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Billing & Settlement
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Process guest table settlements and bill requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Unpaid Orders Queue */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Pending Bills ({unpaidOrders.length})
          </h2>

          {unpaidOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center rounded text-sm text-gray-500">
              No active tables currently require settlement.
            </div>
          ) : (
            <div className="space-y-3">
              {unpaidOrders.map((ord) => {
                const table = tables.find((t) => t.id === ord.tableId);
                const isBillRequested = table?.status === 'bill_requested';

                return (
                  <div
                    key={ord.id}
                    className={`bg-white border rounded p-4 transition-colors ${
                      isBillRequested
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-gray-900">
                            #{ord.orderNumber}
                          </span>
                          {ord.tableNumber && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded border border-gray-200">
                              Table {ord.tableNumber}
                            </span>
                          )}
                          {isBillRequested && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-medium rounded">
                              Bill Requested
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 mt-1">
                          Guest: <span className="font-medium text-gray-900">{ord.customerName}</span> &bull; {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} &bull;{' '}
                          Status: <span className="capitalize text-gray-700">{ord.status}</span>
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{ord.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3.5 py-1.5 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Process Payment
                        </button>
                      </div>
                    </div>

                    {/* Line Items Breakdown */}
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 flex flex-wrap gap-1.5">
                      {ord.items.map((i) => (
                        <span key={i.id} className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                          {i.quantity}x {i.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Settlement Workspace */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded space-y-4 sticky top-24">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Payment Settlement
            </h2>

            {selectedOrder ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Table: {selectedOrder.tableNumber || 'Takeaway'}</span>
                    <span>Order #{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="text-gray-600">Guest: {selectedOrder.customerName}</div>
                </div>

                {/* Amount Due Display */}
                <div className="text-center py-4 bg-gray-50 rounded border border-gray-200">
                  <span className="text-[11px] text-gray-500 font-medium block">
                    Total Amount Due
                  </span>
                  <span className="text-2xl font-semibold text-gray-900">
                    ₹{selectedOrder.total.toFixed(2)}
                  </span>
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-medium text-gray-700 block">Payment Method:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded border text-center transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-[#702B2B] bg-red-50/40 font-medium text-[#702B2B]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                      <span>Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded border text-center transition-colors ${
                        paymentMethod === 'upi'
                          ? 'border-[#702B2B] bg-red-50/40 font-medium text-[#702B2B]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                      <span>UPI QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded border text-center transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-[#702B2B] bg-red-50/40 font-medium text-[#702B2B]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                      <span>Card</span>
                    </button>
                  </div>
                </div>

                {/* Settle Action */}
                <button
                  onClick={() => handleSettle(selectedOrder)}
                  className="w-full py-2.5 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors mt-4"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment & Print Receipt</span>
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-gray-500">
                Select an order from the list on the left to process payment.
              </div>
            )}
          </div>
        </div>
      </div>

      {receiptModalOrder && (
        <ReceiptModal
          order={receiptModalOrder}
          isOpen={!!receiptModalOrder}
          onClose={() => setReceiptModalOrder(null)}
        />
      )}
    </StaffLayout>
  );
}

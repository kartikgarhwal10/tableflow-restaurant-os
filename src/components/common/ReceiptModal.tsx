'use client';

import React from 'react';
import { Order } from '@/types';
import { DEFAULT_RESTAURANT_CONFIG } from '@/lib/constants';
import { Printer, X } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = order.paymentStatus === 'paid';
  const outstandingBalance = isPaid ? 0 : order.total;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 max-w-md w-full rounded-md shadow-xl overflow-hidden border border-gray-200">
        {/* Header Bar */}
        <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Tax Invoice
            </span>
            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-300 font-mono">
              {order.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1 hover:bg-gray-800 rounded text-gray-300 hover:text-white transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 text-xs font-mono leading-relaxed bg-white">
          {/* Restaurant Header */}
          <div className="text-center pb-3 border-b border-dashed border-gray-300">
            <h1 className="text-base font-bold uppercase text-gray-900">
              {DEFAULT_RESTAURANT_CONFIG.name}
            </h1>
            <p className="text-[11px] text-gray-600">
              {DEFAULT_RESTAURANT_CONFIG.address}, {DEFAULT_RESTAURANT_CONFIG.city}
            </p>
            <p className="text-[11px] text-gray-600">
              Phone: {DEFAULT_RESTAURANT_CONFIG.phone}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              GSTIN: {DEFAULT_RESTAURANT_CONFIG.gstNumber} | FSSAI: {DEFAULT_RESTAURANT_CONFIG.fssaiNumber}
            </p>
          </div>

          {/* Bill Metadata */}
          <div className="py-2.5 text-xs border-b border-dashed border-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Order No: <strong>#{order.orderNumber}</strong></span>
              <span>Type: <strong className="uppercase">{order.type.replace('_', ' ')}</strong></span>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between">
                <span>Table: <strong>Table {order.tableNumber}</strong></span>
                <span>Guests: <strong>{order.guestCount || 2}</strong></span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Customer: {order.customerName}</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px] pt-0.5">
              <span>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              <span>Time: {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="py-2.5 border-b border-dashed border-gray-300">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left pb-1 font-semibold">Item</th>
                  <th className="text-center pb-1 font-semibold w-10">Qty</th>
                  <th className="text-right pb-1 font-semibold w-16">Price</th>
                  <th className="text-right pb-1 font-semibold w-20">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="py-1.5 pr-2">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.specialInstructions && (
                        <div className="text-[10px] text-gray-500 italic">
                          &bull; {item.specialInstructions}
                        </div>
                      )}
                    </td>
                    <td className="py-1.5 text-center">{item.quantity}</td>
                    <td className="py-1.5 text-right text-gray-600">₹{item.price}</td>
                    <td className="py-1.5 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="py-2.5 border-b border-dashed border-gray-300 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Item Subtotal</span>
              <span className="tabular-nums">₹{order.subtotal.toFixed(2)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span className="tabular-nums">-₹{order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>CGST (2.5%)</span>
              <span className="tabular-nums">₹{order.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SGST (2.5%)</span>
              <span className="tabular-nums">₹{order.sgst.toFixed(2)}</span>
            </div>

            {order.packagingCharge > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Packaging Charge</span>
                <span className="tabular-nums">₹{order.packagingCharge.toFixed(2)}</span>
              </div>
            )}

            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="tabular-nums">₹{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-300 flex justify-between font-bold text-sm text-gray-900">
              <span>Total Amount</span>
              <span className="tabular-nums">₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Status & Balance */}
          <div className="py-2.5 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span>Payment Status:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isPaid ? 'Paid' : 'Unpaid at Table'}
              </span>
            </div>

            {isPaid && (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>Method:</span>
                  <span className="uppercase font-semibold">{order.paymentMethod || 'CASH / CARD'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Amount Paid:</span>
                  <span className="font-semibold tabular-nums">₹{order.total.toFixed(2)}</span>
                </div>
              </>
            )}

            {!isPaid && (
              <div className="flex justify-between text-red-700 font-semibold pt-1">
                <span>Balance Due:</span>
                <span className="tabular-nums">₹{outstandingBalance.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 text-center text-[10px] text-gray-500 border-t border-dashed border-gray-300 space-y-0.5">
            <p className="font-medium text-gray-700">Thank you for dining at The Copper Table.</p>
            <p>Visit us online: thecoppertable.in</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-200 flex justify-between items-center no-print text-xs">
          <span className="text-gray-500">Press Print to save invoice</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium bg-[#702B2B] hover:bg-[#5A2222] text-white rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

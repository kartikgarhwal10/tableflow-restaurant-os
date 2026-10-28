'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Printer,
  Bell,
  ArrowRight,
  ShieldCheck,
  Phone,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { orders, requestTableBill } = useTableflow();

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [billRequestedMessage, setBillRequestedMessage] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-6 py-20 text-center">
          <h1 className="text-xl font-bold mb-2">Order Not Found</h1>
          <p className="text-gray-600 text-sm mb-6">
            We could not locate this order in the demonstration database.
          </p>
          <Link
            href="/menu"
            className="px-5 py-2.5 bg-[#702B2B] text-white text-xs font-semibold rounded-md"
          >
            Explore Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Received', icon: CheckCircle2, desc: 'Logged in restaurant system' },
    { key: 'accepted', label: 'Order Accepted', icon: Clock, desc: 'Acknowledged by floor staff' },
    { key: 'preparing', label: 'In Kitchen Cooking', icon: ChefHat, desc: 'Cooking in station queue' },
    { key: 'ready', label: 'Plated & Ready', icon: UtensilsCrossed, desc: 'Ready at kitchen pass' },
    { key: 'served', label: order.type === 'delivery' ? 'Out for Delivery' : 'Served at Table', icon: CheckCircle2, desc: 'Dispatched to guest' },
  ];

  const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'served', 'completed'];
  const currentStepIndex = statusOrder.indexOf(order.status);

  const handleRequestBill = () => {
    if (order.tableId) {
      requestTableBill(order.tableId);
      setBillRequestedMessage(true);
      setTimeout(() => setBillRequestedMessage(false), 4000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Banner */}
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Order Status &bull; Live Tracker
            </span>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at{' '}
              {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}{' '}
              &bull; <strong className="uppercase text-gray-800">{order.type.replace('_', ' ')}</strong>
              {order.tableNumber && ` &bull; Table ${order.tableNumber}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReceiptOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-semibold rounded-md shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Tracking Stepper */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
            Preparation &amp; Fulfillment Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className={`p-3.5 rounded-md border transition-all ${
                    isCurrent
                      ? 'bg-red-50/50 border-[#702B2B] ring-1 ring-[#702B2B]'
                      : isPast
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-[#702B2B] text-white'
                          : isPast
                          ? 'bg-emerald-700 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${
                        isCurrent
                          ? 'text-[#702B2B]'
                          : isPast
                          ? 'text-emerald-700'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>

                  <h3 className="text-xs font-bold text-gray-900">
                    {step.label}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                    {step.desc}
                  </p>

                  {isCurrent && (
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold text-[#702B2B] bg-[#702B2B]/10 px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick link to KDS */}
          <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-md text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-gray-600">
              Watching live as demo admin? Check this order ticket in the kitchen bump bar:
            </span>
            <Link
              href="/kitchen/orders"
              className="inline-flex items-center gap-1 text-[#702B2B] hover:underline font-semibold"
            >
              Open Kitchen KDS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Order Items List */}
          <div className="md:col-span-7 bg-white border border-gray-200 rounded-lg p-5 space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Ordered Items ({order.items.length})
            </h2>

            <div className="divide-y divide-gray-100 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-red-700'
                        }`}
                      />
                      <strong className="text-gray-900">
                        {item.quantity}x {item.name}
                      </strong>
                    </div>
                    {item.specialInstructions && (
                      <div className="text-gray-500 italic ml-4 mt-0.5 text-[11px]">
                        &bull; {item.specialInstructions}
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 ml-4 block">
                      Station: {item.station} &bull; Status: <strong className="uppercase">{item.status}</strong>
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {order.specialNotes && (
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-600">
                <strong className="text-gray-800">Special Note:</strong> {order.specialNotes}
              </div>
            )}
          </div>

          {/* Pricing & Bill Actions */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                Payment Summary
              </h2>

              <div className="text-xs space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                    <span className="tabular-nums">-₹{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST (2.5%)</span>
                  <span className="tabular-nums">₹{order.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (2.5%)</span>
                  <span className="tabular-nums">₹{order.sgst.toFixed(2)}</span>
                </div>
                {order.packagingCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Packaging Charge</span>
                    <span className="tabular-nums">₹{order.packagingCharge.toFixed(2)}</span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums">₹{order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#702B2B] tabular-nums">₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Status Pill */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid at Table'}
                </span>
              </div>

              {/* Action: Request Bill if Dine-In */}
              {order.type === 'dine_in' && order.paymentStatus !== 'paid' && (
                <div className="pt-2">
                  <button
                    onClick={handleRequestBill}
                    className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Request Bill at Table</span>
                  </button>
                  {billRequestedMessage && (
                    <p className="text-[11px] text-emerald-800 text-center mt-1.5 font-medium">
                      ✓ Bill request alerted to your floor waiter.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Assistance card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
              <strong className="block text-gray-900 font-semibold">Table Assistance &amp; Queries</strong>
              <p>For extra cutlery or dish questions, contact the concierge desk or inform your floor captain.</p>
              <a
                href="tel:+911412389900"
                className="inline-flex items-center gap-1 text-[#702B2B] font-semibold hover:underline pt-1"
              >
                <Phone className="w-3 h-3" />
                +91 141 238 9900
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Tax Invoice Receipt Modal */}
      <ReceiptModal
        order={order}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}

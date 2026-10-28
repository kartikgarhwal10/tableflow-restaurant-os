'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import { PaymentMethod } from '@/types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  AlertCircle,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartOrderType,
    cartTableNumber,
    cartCalculations,
    createOrder,
    tables,
  } = useTableflow();

  const [customerName, setCustomerName] = useState('Aniruddh Shekhawat');
  const [customerPhone, setCustomerPhone] = useState('+91 98290 12345');
  const [customerEmail, setCustomerEmail] = useState('aniruddh@jaipurguest.com');
  const [deliveryAddress, setDeliveryAddress] = useState(
    cartOrderType === 'delivery' ? 'Flat 402, Royal Palms, C-Scheme, Jaipur 302001' : ''
  );
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-6 py-20 text-center">
          <h1 className="text-xl font-bold mb-2">No Active Order</h1>
          <p className="text-gray-600 text-sm mb-6">Your cart is empty. Please add items before checking out.</p>
          <Link href="/menu" className="px-5 py-2.5 bg-[#702B2B] text-white text-xs font-semibold rounded-md">
            Return to Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please provide your name and phone number for order updates.');
      return;
    }

    if (cartOrderType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please provide a delivery address in Jaipur.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find matching table if dine-in
      const matchedTable = tables.find((t) => t.number === cartTableNumber);

      const newOrder = createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        deliveryAddress: cartOrderType === 'delivery' ? deliveryAddress.trim() : undefined,
        specialNotes: specialNotes.trim(),
        orderType: cartOrderType,
        tableId: matchedTable?.id,
        tableNumber: cartOrderType === 'dine_in' ? cartTableNumber : undefined,
        guestCount: matchedTable?.capacity || 2,
        paymentMethod,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#702B2B', '#111827', '#15803D'],
        });
      } catch (err) {
        // ignore
      }

      // Route to confirmation / live order tracker
      setTimeout(() => {
        router.push(`/order/${newOrder.id}`);
      }, 500);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 border-b border-gray-200 pb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Provide guest details and select payment option
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                1. Guest Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98290 00000"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Email Address (For Tax Invoice)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>

                {cartOrderType === 'delivery' && (
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Delivery Address (Jaipur) *</label>
                    <textarea
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={2}
                      placeholder="Apartment, Street, Landmark, C-Scheme / Civil Lines..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Special Instructions (Optional)</label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Extra cutlery, anniversary celebration..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="text-base font-bold text-gray-900">
                  2. Payment Method
                </h2>
                <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Simulated Demo
                </span>
              </div>

              <div className="space-y-2.5">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-[#702B2B] bg-white ring-1 ring-[#702B2B]'
                      : 'border-gray-200 bg-white hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-0.5 text-[#702B2B] focus:ring-[#702B2B]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-700" />
                      <strong className="text-xs text-gray-900">UPI / QR Code (Google Pay, PhonePe, Paytm)</strong>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Fast simulated zero-fee digital transfer.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#702B2B] bg-white ring-1 ring-[#702B2B]'
                      : 'border-gray-200 bg-white hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 text-[#702B2B] focus:ring-[#702B2B]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-700" />
                      <strong className="text-xs text-gray-900">Credit / Debit Card</strong>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Visa, Mastercard, RuPay cards.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'cash'
                      ? 'border-[#702B2B] bg-white ring-1 ring-[#702B2B]'
                      : 'border-gray-200 bg-white hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="mt-0.5 text-[#702B2B] focus:ring-[#702B2B]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-gray-700" />
                      <strong className="text-xs text-gray-900">
                        {cartOrderType === 'dine_in'
                          ? 'Pay at Table (Cash or Card with Waiter)'
                          : 'Cash on Counter / Delivery'}
                      </strong>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {cartOrderType === 'dine_in'
                        ? 'Order now; settle your bill at the table whenever ready.'
                        : 'Pay cash upon delivery or pickup.'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Submit */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3.5">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                Order Review
              </h2>

              <div className="text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Order Type:</span>
                  <strong className="uppercase text-gray-900">{cartOrderType.replace('_', ' ')}</strong>
                </div>
                {cartOrderType === 'dine_in' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Dining Table:</span>
                    <strong className="text-gray-900">Table {cartTableNumber}</strong>
                  </div>
                )}
              </div>

              {/* Items summary */}
              <div className="divide-y divide-gray-200 max-h-52 overflow-y-auto text-xs py-2 border-y border-gray-200">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="py-2 flex justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{item.quantity}x {item.menuItem.name}</span>
                      {item.selectedVariantName && (
                        <div className="text-[10px] text-gray-500">{item.selectedVariantName}</div>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="text-xs space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{cartCalculations.subtotal.toFixed(2)}</span>
                </div>
                {cartCalculations.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon ({cartCalculations.appliedCoupon})</span>
                    <span className="tabular-nums">-₹{cartCalculations.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="tabular-nums">₹{(cartCalculations.cgst + cartCalculations.sgst).toFixed(2)}</span>
                </div>
                {cartCalculations.packagingCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Packaging Charge</span>
                    <span className="tabular-nums">₹{cartCalculations.packagingCharge.toFixed(2)}</span>
                  </div>
                )}
                {cartCalculations.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums">₹{cartCalculations.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-base font-bold text-gray-900">
                  <span>Total Due</span>
                  <span className="text-2xl text-[#702B2B] tabular-nums">₹{cartCalculations.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#702B2B] hover:bg-[#5A2222] disabled:bg-gray-300 text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors mt-3"
              >
                {isSubmitting ? (
                  <span>Sending to Kitchen...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ticket lands instantly on kitchen bump bar</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

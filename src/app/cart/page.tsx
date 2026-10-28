'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import { AVAILABLE_COUPONS } from '@/lib/constants';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Package,
  Bike,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    cartOrderType,
    setCartOrderType,
    cartTableNumber,
    setCartTableNumber,
    cartCouponCode,
    setCartCouponCode,
    cartCalculations,
    tables,
  } = useTableflow();

  const [inputCoupon, setInputCoupon] = useState(cartCouponCode);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const clean = inputCoupon.trim().toUpperCase();
    if (!clean) {
      setCartCouponCode('');
      return;
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code === clean);
    if (!found) {
      setCouponError('Invalid coupon code. Try JAIPUR15 or ROYAL200.');
      return;
    }

    if (cartCalculations.subtotal < found.minOrder) {
      setCouponError(`Minimum order value of ₹${found.minOrder} required for ${found.code}.`);
      return;
    }

    setCartCouponCode(found.code);
    setCouponSuccess(`Applied! ${found.description}`);
  };

  const handleRemoveCoupon = () => {
    setCartCouponCode('');
    setInputCoupon('');
    setCouponSuccess(null);
    setCouponError(null);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Browse our menu to select freshly prepared curries, tandoori appetizers, breads and desserts.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Title */}
        <div className="mb-6 border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Order Basket
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review your items and select fulfillment method
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-gray-500 hover:text-red-700 underline self-start sm:self-auto"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Items & Fulfillment Type */}
          <div className="lg:col-span-7 space-y-6">
            {/* Fulfillment Mode Selector */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <label className="text-xs font-bold text-gray-800 block mb-2.5">
                Dining &amp; Fulfillment Mode:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCartOrderType('dine_in')}
                  className={`p-3 rounded-md border text-center transition-all ${
                    cartOrderType === 'dine_in'
                      ? 'border-[#702B2B] bg-white text-[#702B2B] font-bold shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <span className="text-xs block">Dine-In Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCartOrderType('takeaway')}
                  className={`p-3 rounded-md border text-center transition-all ${
                    cartOrderType === 'takeaway'
                      ? 'border-[#702B2B] bg-white text-[#702B2B] font-bold shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Package className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <span className="text-xs block">Takeaway Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCartOrderType('delivery')}
                  className={`p-3 rounded-md border text-center transition-all ${
                    cartOrderType === 'delivery'
                      ? 'border-[#702B2B] bg-white text-[#702B2B] font-bold shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Bike className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <span className="text-xs block">Home Delivery</span>
                </button>
              </div>

              {/* Table Selector if Dine-in */}
              {cartOrderType === 'dine_in' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Select Your Dining Table:
                  </label>
                  <select
                    value={cartTableNumber}
                    onChange={(e) => setCartTableNumber(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.number}>
                        Table {t.number} &mdash; {t.name} ({t.capacity} guests &bull; {t.section})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-4 flex gap-4 items-start">
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-18 h-18 object-cover rounded-md shrink-0 border border-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.menuItem.name}
                        </h3>
                        {item.selectedVariantName && (
                          <div className="text-[11px] text-gray-600">
                            Portion: {item.selectedVariantName}
                          </div>
                        )}
                        {item.selectedAddonNames && item.selectedAddonNames.length > 0 && (
                          <div className="text-[11px] text-gray-500">
                            Add-ons: {item.selectedAddonNames.join(', ')}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <div className="text-[11px] text-gray-500 italic mt-0.5">
                            Note: {item.specialInstructions}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-900 tabular-nums shrink-0 ml-2">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 bg-white rounded">
                        <button
                          onClick={() => updateCartItemQty(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQty(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-700 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs">
              <Link
                href="/menu"
                className="text-[#702B2B] hover:underline font-semibold"
              >
                + Add more items from menu
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-5">
            {/* Coupon Box */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                <Tag className="w-3.5 h-3.5 text-gray-600" />
                <span>Apply Promotion or Coupon</span>
              </div>

              {cartCalculations.appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      Coupon <strong>{cartCalculations.appliedCoupon}</strong> (-₹{cartCalculations.discountAmount})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-emerald-800 hover:text-red-700 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon code (e.g., JAIPUR15)"
                    className="flex-1 text-xs p-2 bg-white border border-gray-300 rounded uppercase font-mono tracking-wide text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <div className="text-xs text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </div>
              )}

              {/* Sample Coupons */}
              <div className="pt-1 text-[11px] text-gray-500 space-y-1">
                <span className="font-medium text-gray-600">Sample Coupons:</span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setInputCoupon(c.code);
                        setCartCouponCode(c.code);
                      }}
                      className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-mono text-[10px]"
                    >
                      {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bill Summary Breakdown */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                Bill Summary
              </h2>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-900 tabular-nums">₹{cartCalculations.subtotal.toFixed(2)}</span>
                </div>

                {cartCalculations.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-₹{cartCalculations.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>CGST (2.5%)</span>
                  <span className="tabular-nums">₹{cartCalculations.cgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>SGST (2.5%)</span>
                  <span className="tabular-nums">₹{cartCalculations.sgst.toFixed(2)}</span>
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
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-gray-900 block">Total Amount</span>
                  <span className="text-[10px] text-gray-500">Includes 5% GST</span>
                </div>
                <span className="text-2xl font-bold text-[#702B2B] tabular-nums">
                  ₹{cartCalculations.total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full mt-3 py-3 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

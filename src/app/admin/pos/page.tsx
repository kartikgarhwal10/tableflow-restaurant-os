'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import { MenuItem, Order, OrderType, PaymentMethod } from '@/types';
import {
  Search,
  Trash2,
  Banknote,
  QrCode,
  CreditCard,
} from 'lucide-react';

export default function AdminPOSPage() {
  const { menuItems, categories, tables, createOrder } = useTableflow();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchDish, setSearchDish] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [selectedTableNumber, setSelectedTableNumber] = useState('T-01');
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [customerPhone, setCustomerPhone] = useState('+91 98290 00000');

  // POS Ticket Items
  const [ticketItems, setTicketItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const addItemToTicket = (item: MenuItem) => {
    setTicketItems((prev) => {
      const idx = prev.findIndex((p) => p.item.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setTicketItems((prev) => prev.filter((p) => p.item.id !== itemId));
    } else {
      setTicketItems((prev) =>
        prev.map((p) => (p.item.id === itemId ? { ...p, quantity: newQty } : p))
      );
    }
  };

  const clearTicket = () => {
    setTicketItems([]);
    setCustomDiscount(0);
  };

  // Calculations
  const subtotal = ticketItems.reduce((acc, p) => acc + p.item.price * p.quantity, 0);
  const discountAmt = Math.min(subtotal, customDiscount);
  const taxable = subtotal - discountAmt;
  const cgst = Number(((taxable * 2.5) / 100).toFixed(2));
  const sgst = Number(((taxable * 2.5) / 100).toFixed(2));
  const grandTotal = Number((taxable + cgst + sgst).toFixed(2));

  const handleCheckoutPOS = (method?: PaymentMethod) => {
    if (ticketItems.length === 0) return;

    const matchedTable = tables.find((t) => t.number === selectedTableNumber);

    const newOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      tableId: matchedTable?.id,
      tableNumber: orderType === 'dine_in' ? selectedTableNumber : undefined,
      guestCount: matchedTable?.capacity || 2,
      paymentMethod: method,
      customDiscount,
      specialNotes: 'Billed via POS Terminal',
    });

    setReceiptOrder(newOrder);
    clearTicket();
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (searchDish && !item.name.toLowerCase().includes(searchDish.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            POS & Billing
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Table and counter order entry with instant receipt generation
          </p>
        </div>

        {/* Order Mode & Table Select */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium text-gray-800"
          >
            <option value="dine_in">Dine-In</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>

          {orderType === 'dine_in' && (
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium text-gray-800"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.number}>
                  Table {t.number} ({t.section})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Menu & Search */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Tabs */}
          <div className="bg-white border border-gray-200 p-3 rounded space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
                placeholder="Search dish name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded whitespace-nowrap text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#702B2B] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                All Items
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1 rounded whitespace-nowrap text-xs font-medium transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-[#702B2B] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Grid for Touch POS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto">
            {filteredMenuItems.map((dish) => (
              <button
                key={dish.id}
                type="button"
                onClick={() => addItemToTicket(dish)}
                className="bg-white border border-gray-200 hover:border-[#702B2B] p-3 rounded text-left flex flex-col justify-between hover:shadow-xs transition-colors group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                    <span className="text-[10px] text-gray-400 capitalize">
                      {dish.station}
                    </span>
                  </div>
                  <h2 className="text-xs font-semibold text-gray-900 group-hover:text-[#702B2B] line-clamp-1">
                    {dish.name}
                  </h2>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {dish.hindiName}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-900">₹{dish.price}</span>
                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    + Add
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Active POS Bill Ticket */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-5 rounded flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Current Order
                </h2>
                <span className="text-[11px] text-gray-500 capitalize">
                  {orderType.replace('_', ' ')} &bull; {orderType === 'dine_in' ? `Table ${selectedTableNumber}` : 'Counter'}
                </span>
              </div>
              <button
                onClick={clearTicket}
                className="text-gray-400 hover:text-red-700 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            {/* Customer Quick Info */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="p-1.5 bg-white border border-gray-300 rounded text-gray-900"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone"
                className="p-1.5 bg-white border border-gray-300 rounded text-gray-900"
              />
            </div>

            {/* Ticket Items List */}
            <div className="border border-gray-200 rounded divide-y divide-gray-100 max-h-56 overflow-y-auto text-xs bg-white">
              {ticketItems.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  Select dishes from the menu to populate ticket.
                </div>
              ) : (
                ticketItems.map((p) => (
                  <div key={p.item.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 block">{p.item.name}</span>
                      <span className="text-[11px] text-gray-500">₹{p.item.price} each</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQty(p.item.id, p.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-semibold text-gray-700"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-gray-900">{p.quantity}</span>
                        <button
                          onClick={() => updateQty(p.item.id, p.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-semibold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900 w-14 text-right">
                        ₹{(p.item.price * p.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Calculations & Settle Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-gray-600">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(Number(e.target.value) || 0)}
                className="w-20 p-1 text-right bg-white border border-gray-300 rounded text-gray-900"
              />
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Taxes (5% GST):</span>
              <span className="text-gray-900 font-medium">₹{(cgst + sgst).toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-sm text-gray-900">
              <span>Total:</span>
              <span className="text-xl font-bold text-[#702B2B]">₹{grandTotal.toFixed(2)}</span>
            </div>

            {/* Quick Settle Tender Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                disabled={ticketItems.length === 0}
                onClick={() => handleCheckoutPOS('cash')}
                className="py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded text-xs font-medium flex flex-col items-center gap-0.5 transition-colors"
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                disabled={ticketItems.length === 0}
                onClick={() => handleCheckoutPOS('upi')}
                className="py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded text-xs font-medium flex flex-col items-center gap-0.5 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>UPI</span>
              </button>

              <button
                type="button"
                disabled={ticketItems.length === 0}
                onClick={() => handleCheckoutPOS('card')}
                className="py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded text-xs font-medium flex flex-col items-center gap-0.5 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>
            </div>

            <button
              type="button"
              disabled={ticketItems.length === 0}
              onClick={() => handleCheckoutPOS(undefined)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-medium transition-colors"
            >
              Send to Kitchen (Unpaid KOT)
            </button>
          </div>
        </div>
      </div>

      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          isOpen={!!receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </AdminLayout>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StaffLayout from '@/components/staff/StaffLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Table, TableStatus, MenuItem } from '@/types';
import {
  Users,
  UtensilsCrossed,
  Receipt,
  Check,
  Plus,
  Clock,
  X,
  Search,
  CheckCircle,
} from 'lucide-react';

export default function StaffFloorPage() {
  const {
    tables,
    orders,
    reservations,
    updateTableStatus,
    requestTableBill,
    menuItems,
    createOrder,
    updateReservationStatus,
  } = useTableflow();

  const [sectionFilter, setSectionFilter] = useState<'all' | 'courtyard' | 'indoor' | 'terrace'>('all');
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<Table | null>(null);

  // Quick Order Punch modal state
  const [punchItems, setPunchItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [searchDish, setSearchDish] = useState('');
  const [guestName, setGuestName] = useState('Table Walk-in Guest');

  const filteredTables = tables.filter((t) => {
    if (sectionFilter === 'all') return true;
    return t.section === sectionFilter;
  });

  // Summary counts
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'seated' || t.status === 'bill_requested').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const billCount = tables.filter((t) => t.status === 'bill_requested').length;

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return { label: 'Available', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'reserved':
        return { label: 'Reserved', color: 'bg-blue-50 text-blue-800 border-blue-300' };
      case 'seated':
        return { label: 'Occupied', color: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 'bill_requested':
        return { label: 'Bill Due', color: 'bg-red-50 text-red-800 border-red-300' };
      case 'cleaning':
        return { label: 'Cleaning', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const openOrderPunchModal = (table: Table) => {
    setSelectedTableForOrder(table);
    setPunchItems([]);
    setSearchDish('');
    setGuestName(`Table ${table.number} Guest`);
  };

  const handleAddItemToPunch = (item: MenuItem) => {
    setPunchItems((prev) => {
      const idx = prev.findIndex((p) => p.item.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveItemFromPunch = (itemId: string) => {
    setPunchItems((prev) => prev.filter((p) => p.item.id !== itemId));
  };

  const handlePunchOrder = () => {
    if (!selectedTableForOrder || punchItems.length === 0) return;

    createOrder({
      customerName: guestName,
      customerPhone: '+91 98290 00000',
      orderType: 'dine_in',
      tableId: selectedTableForOrder.id,
      tableNumber: selectedTableForOrder.number,
      guestCount: selectedTableForOrder.capacity,
      specialNotes: 'Punched via Floor Terminal',
    });

    setSelectedTableForOrder(null);
    setPunchItems([]);
  };

  return (
    <StaffLayout>
      {/* Page Title & Operational Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Floor Map &amp; Table Service
          </h1>
          <p className="text-xs text-gray-500">
            Realtime occupancy, order dispatch, and bill settlement
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-200/80 rounded-md self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setSectionFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              sectionFilter === 'all'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({tables.length})
          </button>
          <button
            onClick={() => setSectionFilter('courtyard')}
            className={`px-3 py-1.5 rounded transition-colors ${
              sectionFilter === 'courtyard'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Courtyard (4)
          </button>
          <button
            onClick={() => setSectionFilter('indoor')}
            className={`px-3 py-1.5 rounded transition-colors ${
              sectionFilter === 'indoor'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hall (4)
          </button>
          <button
            onClick={() => setSectionFilter('terrace')}
            className={`px-3 py-1.5 rounded transition-colors ${
              sectionFilter === 'terrace'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Terrace (4)
          </button>
        </div>
      </div>

      {/* Glance KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-md p-3 text-xs">
          <span className="text-gray-500 block">Available Tables</span>
          <strong className="text-lg font-bold text-emerald-700">{availableCount}</strong>
          <span className="text-[11px] text-gray-400 block">Ready for seating</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-3 text-xs">
          <span className="text-gray-500 block">Occupied Tables</span>
          <strong className="text-lg font-bold text-amber-700">{occupiedCount}</strong>
          <span className="text-[11px] text-gray-400 block">Dining active</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-3 text-xs">
          <span className="text-gray-500 block">Ready to Serve</span>
          <strong className="text-lg font-bold text-[#702B2B]">{readyCount}</strong>
          <span className="text-[11px] text-gray-400 block">Kitchen plated</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-3 text-xs">
          <span className="text-gray-500 block">Bill Requests</span>
          <strong className="text-lg font-bold text-red-700">{billCount}</strong>
          <span className="text-[11px] text-gray-400 block">Waiting settlement</span>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const badge = getStatusBadge(table.status);
          const activeOrder = orders.find((o) => o.id === table.activeOrderId);
          const activeRes = reservations.find((r) => r.id === table.activeReservationId);

          return (
            <div
              key={table.id}
              className={`bg-white border rounded-lg p-4 flex flex-col justify-between transition-shadow hover:shadow-sm ${
                table.status === 'bill_requested'
                  ? 'border-red-400 ring-1 ring-red-400'
                  : table.status === 'seated'
                  ? 'border-amber-300'
                  : 'border-gray-200'
              }`}
            >
              <div>
                {/* Table Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {table.section}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">
                      Table {table.number}
                    </h2>
                    <p className="text-xs text-gray-500">{table.name}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>Capacity: {table.capacity} guests</span>
                </div>

                {/* Context: Active Order or Reservation */}
                {activeOrder && (
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200 text-xs space-y-1 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">#{activeOrder.orderNumber}</span>
                      <span className="text-[10px] uppercase font-semibold text-gray-700 bg-gray-200 px-1.5 py-0.2 rounded">
                        {activeOrder.status}
                      </span>
                    </div>
                    <div className="text-gray-600 truncate">
                      {activeOrder.customerName} &bull; {activeOrder.items.length} dishes
                    </div>
                    <div className="font-semibold text-gray-900 pt-1 border-t border-gray-200 flex justify-between">
                      <span>Total:</span>
                      <span className="tabular-nums">₹{activeOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {activeRes && !activeOrder && (
                  <div className="p-2.5 bg-blue-50 rounded border border-blue-200 text-xs space-y-0.5 mb-3 text-blue-950">
                    <div className="font-semibold">Booking #{activeRes.referenceCode}</div>
                    <div>{activeRes.customerName} ({activeRes.guestCount} guests)</div>
                    <div className="text-[11px] text-blue-700">Slot: {activeRes.timeSlot}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100">
                {table.status === 'available' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openOrderPunchModal(table)}
                      className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#702B2B] hover:bg-[#5A2222] rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Take Order
                    </button>
                    <button
                      onClick={() => updateTableStatus(table.id, 'seated')}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 transition-colors"
                      title="Seat walk-in party"
                    >
                      Seat
                    </button>
                  </div>
                )}

                {table.status === 'seated' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openOrderPunchModal(table)}
                      className="flex-1 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 transition-colors"
                    >
                      + Add Dishes
                    </button>
                    <button
                      onClick={() => requestTableBill(table.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-black rounded transition-colors"
                    >
                      Request Bill
                    </button>
                  </div>
                )}

                {table.status === 'bill_requested' && (
                  <Link
                    href="/staff/billing"
                    className="w-full py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    Settle Bill (Desk)
                  </Link>
                )}

                {table.status === 'cleaning' && (
                  <button
                    onClick={() => updateTableStatus(table.id, 'available')}
                    className="w-full py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Clean &amp; Available
                  </button>
                )}

                {table.status === 'reserved' && (
                  <button
                    onClick={() => {
                      if (activeRes) {
                        updateReservationStatus(activeRes.id, 'seated', table.id);
                      } else {
                        updateTableStatus(table.id, 'seated');
                      }
                    }}
                    className="w-full py-1.5 text-xs font-semibold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded border border-blue-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Seat Reserved Guests
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK ORDER PUNCH MODAL */}
      {selectedTableForOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gray-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold">
                  Fast Order Punch
                </span>
                <h3 className="text-base font-bold">
                  Take Order for Table {selectedTableForOrder.number} ({selectedTableForOrder.name})
                </h3>
              </div>
              <button
                onClick={() => setSelectedTableForOrder(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Party / Guest</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Search Dishes</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchDish}
                      onChange={(e) => setSearchDish(e.target.value)}
                      placeholder="Dal Makhani, Tikka..."
                      className="w-full pl-8 p-2 text-xs bg-gray-50 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Menu items list */}
              <div className="border border-gray-200 rounded divide-y divide-gray-100 max-h-44 overflow-y-auto bg-white text-xs">
                {menuItems
                  .filter((m) =>
                    searchDish ? m.name.toLowerCase().includes(searchDish.toLowerCase()) : true
                  )
                  .map((dish) => (
                    <div key={dish.id} className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <span className="font-medium text-gray-900">{dish.name}</span>
                        <span className="text-gray-500 text-[11px] ml-2 font-mono">₹{dish.price}</span>
                      </div>
                      <button
                        onClick={() => handleAddItemToPunch(dish)}
                        className="px-2.5 py-1 text-xs font-semibold bg-[#702B2B] hover:bg-[#5A2222] text-white rounded transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
              </div>

              {/* Selected KOT Punch items */}
              <div>
                <h4 className="font-semibold text-xs text-gray-700 mb-2">
                  Order Items ({punchItems.length}):
                </h4>
                {punchItems.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No dishes added yet.</p>
                ) : (
                  <div className="border border-gray-200 rounded divide-y divide-gray-100 bg-gray-50 text-xs">
                    {punchItems.map((p) => (
                      <div key={p.item.id} className="p-2.5 flex items-center justify-between">
                        <div>
                          <strong className="text-gray-900">{p.quantity}x {p.item.name}</strong>
                          <span className="text-gray-600 ml-2 font-mono">
                            ₹{(p.item.price * p.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddItemToPunch(p.item)}
                            className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 font-bold text-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItemFromPunch(p.item.id)}
                            className="text-red-700 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-gray-500">Subtotal: </span>
                <strong className="text-base text-gray-900 tabular-nums font-bold">
                  ₹{punchItems.reduce((acc, p) => acc + p.item.price * p.quantity, 0).toFixed(2)}
                </strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTableForOrder(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePunchOrder}
                  disabled={punchItems.length === 0}
                  className="px-5 py-1.5 bg-[#702B2B] hover:bg-[#5A2222] disabled:bg-gray-300 text-white text-xs font-semibold rounded shadow-xs transition-colors"
                >
                  Send to Kitchen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

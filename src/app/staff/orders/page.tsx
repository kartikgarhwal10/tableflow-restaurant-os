'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StaffLayout from '@/components/staff/StaffLayout';
import ReceiptModal from '@/components/common/ReceiptModal';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Order } from '@/types';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  Printer,
  ChevronRight,
  Bell,
} from 'lucide-react';

export default function StaffOrdersPage() {
  const { orders, updateOrderStatus, requestTableBill } = useTableflow();

  const [filter, setFilter] = useState<'all' | 'ready' | 'preparing' | 'served'>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Active floor orders
  const activeOrders = orders.filter((o) => {
    if (filter === 'ready') return o.status === 'ready';
    if (filter === 'preparing') return o.status === 'preparing' || o.status === 'accepted';
    if (filter === 'served') return o.status === 'served';
    return o.status !== 'completed' && o.status !== 'cancelled';
  });

  const readyCount = orders.filter((o) => o.status === 'ready').length;

  const handleMarkServed = (orderId: string, tableNumber?: string) => {
    updateOrderStatus(orderId, 'served', 'Ravi Kumar (Floor Captain)', `Delivered to Table ${tableNumber || ''}`);
  };

  return (
    <StaffLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Active Orders &amp; Service Queue
          </h1>
          <p className="text-xs text-gray-500">
            Realtime tracking from kitchen pass to dining tables
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-200/80 rounded-md text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Active ({orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              filter === 'ready'
                ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Ready to Serve ({readyCount})
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filter === 'preparing'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            In Kitchen
          </button>
          <button
            onClick={() => setFilter('served')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filter === 'served'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Served / Dining
          </button>
        </div>
      </div>

      {/* Orders List */}
      {activeOrders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-800">No Orders in this Queue</h3>
          <p className="text-xs text-gray-500 mt-1">Orders placed by guests or floor staff will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((ord) => {
            const isReady = ord.status === 'ready';

            return (
              <div
                key={ord.id}
                className={`bg-white border rounded-lg p-5 transition-shadow hover:shadow-xs ${
                  isReady
                    ? 'border-emerald-400 ring-1 ring-emerald-400 bg-emerald-50/20'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-lg font-bold text-gray-900">
                        #{ord.orderNumber}
                      </span>
                      {ord.tableNumber && (
                        <span className="px-2 py-0.5 bg-[#702B2B] text-white text-xs font-semibold rounded">
                          Table {ord.tableNumber}
                        </span>
                      )}
                      <span className="text-xs uppercase text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-medium">
                        {ord.type.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded font-semibold uppercase ${
                          isReady
                            ? 'bg-emerald-700 text-white'
                            : ord.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isReady ? 'Ready to Serve' : ord.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Guest: <strong className="text-gray-800">{ord.customerName}</strong> ({ord.customerPhone}) &bull; Placed at{' '}
                      {new Date(ord.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    {ord.specialNotes && (
                      <div className="text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                        <strong>Guest Note:</strong> {ord.specialNotes}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    {isReady && (
                      <button
                        onClick={() => handleMarkServed(ord.id, ord.tableNumber)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Served
                      </button>
                    )}

                    {ord.type === 'dine_in' && ord.status === 'served' && (
                      <button
                        onClick={() => ord.tableId && requestTableBill(ord.tableId)}
                        className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        Request Bill
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                      title="View Bill"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      Invoice
                    </button>

                    <Link
                      href={`/staff/orders/${ord.id}`}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {ord.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-gray-50 rounded border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold text-gray-900">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          Station: {item.station}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                          item.status === 'ready' || item.status === 'served'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          isOpen={!!selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </StaffLayout>
  );
}

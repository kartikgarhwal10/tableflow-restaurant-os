'use client';

import React, { useState, useEffect } from 'react';
import KDSLayout from '@/components/kitchen/KDSLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Order } from '@/types';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function KitchenOrdersPage() {
  const { orders, updateOrderStatus, updateOrderItemStatus, activeStaff } = useTableflow();

  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'preparing' | 'ready' | 'history'>('all');
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  // Tick timer every 10 seconds for real elapsed timers on client
  useEffect(() => {
    setCurrentTime(Date.now());
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const calculateElapsedMinutes = (createdAt: string) => {
    if (!currentTime) return 10;
    const diffMs = currentTime - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  };

  // Filter orders
  const displayOrders = orders.filter((o) => {
    if (activeFilter === 'new') return o.status === 'pending' || o.status === 'accepted';
    if (activeFilter === 'preparing') return o.status === 'preparing';
    if (activeFilter === 'ready') return o.status === 'ready';
    if (activeFilter === 'history') return o.status === 'served' || o.status === 'completed';
    return o.status !== 'completed' && o.status !== 'cancelled';
  });

  const handleStartPrep = (order: Order) => {
    updateOrderStatus(order.id, 'preparing', activeStaff?.name || 'Chef Vikram', 'Started kitchen preparation');
  };

  const handleBumpReady = (order: Order) => {
    updateOrderStatus(order.id, 'ready', activeStaff?.name || 'Chef Vikram', 'Plated and ready at pass');
  };

  const toggleItemReady = (orderId: string, itemId: string, currentStatus: string) => {
    const next = currentStatus === 'ready' ? 'preparing' : 'ready';
    updateOrderItemStatus(orderId, itemId, next as any);
  };

  return (
    <KDSLayout>
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white font-mono flex items-center gap-2">
            <span>Kitchen Order Tickets (KOT)</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Click dishes to check off plating &bull; Tap action button to update ticket status
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Live ({orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeFilter === 'new'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            New ({orders.filter((o) => o.status === 'pending' || o.status === 'accepted').length})
          </button>
          <button
            onClick={() => setActiveFilter('preparing')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeFilter === 'preparing'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cooking ({orders.filter((o) => o.status === 'preparing').length})
          </button>
          <button
            onClick={() => setActiveFilter('ready')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeFilter === 'ready'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Ready at Pass ({orders.filter((o) => o.status === 'ready').length})
          </button>
          <button
            onClick={() => setActiveFilter('history')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeFilter === 'history'
                ? 'bg-zinc-700 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Past Served
          </button>
        </div>
      </div>

      {/* KOT Cards Grid */}
      {displayOrders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 font-mono text-sm">
          No tickets in this kitchen station queue.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayOrders.map((ord) => {
            const elapsedMins = calculateElapsedMinutes(ord.createdAt);
            const isOverdue = elapsedMins >= 20;
            const isWarning = elapsedMins >= 12 && !isOverdue;
            const isPreparing = ord.status === 'preparing';
            const isReady = ord.status === 'ready';

            return (
              <div
                key={ord.id}
                className={`bg-zinc-900 border rounded-lg overflow-hidden flex flex-col justify-between shadow-md transition-shadow ${
                  isOverdue
                    ? 'border-red-500 ring-1 ring-red-500'
                    : isWarning
                    ? 'border-amber-500'
                    : isReady
                    ? 'border-emerald-600'
                    : 'border-zinc-800'
                }`}
              >
                {/* KOT Header */}
                <div
                  className={`p-3 border-b font-mono ${
                    isOverdue
                      ? 'bg-red-950/80 border-red-800 text-white'
                      : isReady
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-100'
                      : isPreparing
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold tracking-tight text-white">
                      #{ord.orderNumber}
                    </span>
                    {ord.tableNumber ? (
                      <span className="px-2.5 py-0.5 bg-[#702B2B] text-white font-bold rounded text-xs">
                        TABLE {ord.tableNumber}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-zinc-700 text-zinc-200 uppercase font-bold text-[10px] rounded">
                        {ord.type}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-zinc-300 font-sans truncate max-w-[140px]">
                      {ord.customerName}
                    </span>

                    {/* Timer Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        isOverdue
                          ? 'bg-red-700 text-white'
                          : isWarning
                          ? 'bg-amber-600 text-white'
                          : 'bg-zinc-950 text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {elapsedMins}m elapsed
                      {isOverdue && ' (LATE)'}
                    </span>
                  </div>
                </div>

                {/* KOT Items Checklist */}
                <div className="p-3.5 space-y-2.5 font-mono flex-1 overflow-y-auto max-h-64 divide-y divide-zinc-800">
                  {ord.items.map((item) => {
                    const itemIsReady = item.status === 'ready' || item.status === 'served';

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemReady(ord.id, item.id, item.status)}
                        className={`pt-2 first:pt-0 flex items-start gap-2.5 cursor-pointer group select-none ${
                          itemIsReady ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            itemIsReady
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-zinc-600 group-hover:border-zinc-400 bg-zinc-950'
                          }`}
                        >
                          {itemIsReady && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="flex-1 text-xs">
                          <div className="flex items-baseline justify-between">
                            <span
                              className={`font-semibold tracking-wide ${
                                itemIsReady ? 'line-through text-zinc-400' : 'text-white'
                              }`}
                            >
                              <strong className="text-amber-400 mr-1 text-sm">
                                {item.quantity}x
                              </strong>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase">
                              [{item.station}]
                            </span>
                          </div>

                          {item.specialInstructions && (
                            <div className="text-[11px] text-amber-300 italic mt-0.5 font-sans">
                              &bull; {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Special Order Notes */}
                {ord.specialNotes && (
                  <div className="px-3.5 py-1.5 bg-zinc-950 border-t border-zinc-800 text-[11px] text-amber-300 font-sans">
                    <strong>Note:</strong> {ord.specialNotes}
                  </div>
                )}

                {/* Bump Bar Action */}
                <div className="p-3 bg-zinc-950 border-t border-zinc-800">
                  {ord.status === 'pending' || ord.status === 'accepted' ? (
                    <button
                      onClick={() => handleStartPrep(ord)}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ChefHat className="w-4 h-4" />
                      Start Cooking (Deduct Stock)
                    </button>
                  ) : isPreparing ? (
                    <button
                      onClick={() => handleBumpReady(ord)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Order Ready (Bump Pass)
                    </button>
                  ) : isReady ? (
                    <div className="text-center py-2 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 rounded border border-emerald-900">
                      ✓ Ready at Pass &bull; Waiter Notified
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs font-mono text-zinc-400 uppercase">
                      Order {ord.status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </KDSLayout>
  );
}

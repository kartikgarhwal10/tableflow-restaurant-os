'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import KDSLayout from '@/components/kitchen/KDSLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Clock, Check } from 'lucide-react';

export default function StationKDSPage() {
  const params = useParams();
  const stationId = params.id as string;
  const { orders, updateOrderItemStatus } = useTableflow();

  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const calculateElapsedMinutes = (createdAt: string) => {
    if (!currentTime) return 10;
    const diffMs = currentTime - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  };

  // Filter orders that have items for this station
  const stationOrders = orders.filter((o) => {
    if (o.status === 'completed' || o.status === 'cancelled') return false;
    return o.items.some((item) => item.station === stationId || stationId === 'all');
  });

  const getStationTitle = () => {
    switch (stationId) {
      case 'tandoor':
        return 'Tandoor Station';
      case 'curry':
        return 'Curry Station';
      case 'breads':
        return 'Breads & Rice Station';
      case 'desserts':
        return 'Desserts Station';
      case 'bar':
        return 'Beverages Station';
      default:
        return 'Kitchen Station';
    }
  };

  const toggleItemReady = (orderId: string, itemId: string, currentStatus: string) => {
    const next = currentStatus === 'ready' ? 'preparing' : 'ready';
    updateOrderItemStatus(orderId, itemId, next as any);
  };

  return (
    <KDSLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            {getStationTitle()}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Dedicated station prep queue
          </p>
        </div>
        <div className="text-xs text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
          Active Tickets: <strong className="text-white">{stationOrders.length}</strong>
        </div>
      </div>

      {stationOrders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 text-sm">
          No pending orders for {getStationTitle()}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stationOrders.map((ord) => {
            const elapsedMins = calculateElapsedMinutes(ord.createdAt);
            const isOverdue = elapsedMins >= 20;
            const stationItems = ord.items.filter(
              (i) => i.station === stationId || stationId === 'all'
            );

            return (
              <div
                key={ord.id}
                className={`bg-zinc-900 border rounded overflow-hidden flex flex-col justify-between ${
                  isOverdue ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                }`}
              >
                <div className="p-3.5 bg-zinc-800 border-b border-zinc-700 text-zinc-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">#{ord.orderNumber}</span>
                    {ord.tableNumber ? (
                      <span className="px-2 py-0.5 bg-[#702B2B] text-white text-xs font-medium rounded">
                        Table {ord.tableNumber}
                      </span>
                    ) : (
                      <span className="text-[11px] uppercase bg-zinc-700 text-zinc-200 px-2 py-0.5 rounded font-medium">
                        {ord.type}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-zinc-400">
                    <span>{ord.customerName}</span>
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {elapsedMins}m ago
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 divide-y divide-zinc-800">
                  {stationItems.map((item) => {
                    const itemIsReady = item.status === 'ready' || item.status === 'served';

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemReady(ord.id, item.id, item.status)}
                        className={`pt-2.5 first:pt-0 flex items-start gap-2.5 cursor-pointer ${
                          itemIsReady ? 'opacity-40' : ''
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            itemIsReady
                              ? 'bg-green-600 border-green-500 text-white'
                              : 'border-zinc-600 bg-zinc-800'
                          }`}
                        >
                          {itemIsReady && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <span
                            className={`text-sm font-medium ${
                              itemIsReady ? 'line-through text-zinc-400' : 'text-white'
                            }`}
                          >
                            <strong className="text-amber-400 mr-1.5">{item.quantity}x</strong>
                            {item.name}
                          </span>
                          {item.specialInstructions && (
                            <div className="text-xs text-amber-300 italic mt-0.5">
                              &bull; {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-zinc-950 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      stationItems.forEach((item) => {
                        updateOrderItemStatus(ord.id, item.id, 'ready');
                      });
                    }}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-xs rounded transition-colors"
                  >
                    Mark Station Items Ready
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </KDSLayout>
  );
}

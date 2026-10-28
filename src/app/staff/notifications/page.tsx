'use client';

import React from 'react';
import StaffLayout from '@/components/staff/StaffLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Bell, CheckCheck, UtensilsCrossed, Receipt } from 'lucide-react';

export default function StaffNotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useTableflow();

  const floorNotifications = notifications.filter(
    (n) => n.targetRole === 'waiter' || n.targetRole === 'all'
  );

  return (
    <StaffLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Notifications & Alerts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational alerts and floor updates
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-medium text-[#702B2B] hover:underline self-start sm:self-auto flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100">
        {floorNotifications.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No active alerts at this moment.
          </div>
        ) : (
          floorNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                !notif.read ? 'bg-red-50/20' : 'hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                  notif.type === 'order_ready'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : notif.type === 'bill_requested'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {notif.type === 'order_ready' ? (
                  <UtensilsCrossed className="w-4 h-4" />
                ) : notif.type === 'bill_requested' ? (
                  <Receipt className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">
                    {notif.title}
                  </h2>
                  <span className="text-[11px] text-gray-500 shrink-0">
                    {new Date(notif.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#702B2B] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </StaffLayout>
  );
}

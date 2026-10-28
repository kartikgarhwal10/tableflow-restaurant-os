'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  LayoutGrid,
  ClipboardList,
  CalendarDays,
  Receipt,
  Bell,
  UtensilsCrossed,
  User,
} from 'lucide-react';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tables, orders, notifications, activeStaff } = useTableflow();

  // Operational metrics
  const readyToServeCount = orders.filter((o) => o.status === 'ready').length;
  const billRequestedCount = tables.filter((t) => t.status === 'bill_requested').length;
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'preparing' || o.status === 'ready' || o.status === 'accepted'
  ).length;

  const navItems = [
    {
      label: 'Tables & Floor',
      href: '/staff/floor',
      icon: LayoutGrid,
      badge: billRequestedCount > 0 ? `${billRequestedCount} bill` : undefined,
      badgeColor: 'bg-amber-600',
    },
    {
      label: 'Active Orders',
      href: '/staff/orders',
      icon: ClipboardList,
      badge: readyToServeCount > 0 ? `${readyToServeCount} ready!` : activeOrdersCount > 0 ? `${activeOrdersCount}` : undefined,
      badgeColor: readyToServeCount > 0 ? 'bg-emerald-600' : 'bg-gray-700',
    },
    {
      label: 'Billing Desk',
      href: '/staff/billing',
      icon: Receipt,
      badge: billRequestedCount > 0 ? `${billRequestedCount}` : undefined,
      badgeColor: 'bg-red-600',
    },
    {
      label: 'Reservations',
      href: '/staff/reservations',
      icon: CalendarDays,
    },
    {
      label: 'Alerts',
      href: '/staff/notifications',
      icon: Bell,
      badge: notifications.filter((n) => !n.read && (n.targetRole === 'waiter' || n.targetRole === 'all')).length || undefined,
      badgeColor: 'bg-[#702B2B]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Staff Operational Header */}
      <header className="bg-zinc-900 text-white px-4 py-2.5 border-b border-zinc-800 sticky top-[33px] z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#702B2B] flex items-center justify-center font-bold text-xs text-white">
              {activeStaff?.name?.slice(0, 2).toUpperCase() || 'RK'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-tight text-white">
                  {activeStaff?.name || 'Ravi Kumar'}
                </h1>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                  Floor Captain
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                The Copper Table &bull; Live Service Terminal
              </p>
            </div>
          </div>

          {/* Quick Action Status Pills */}
          <div className="flex items-center gap-2 text-xs">
            {readyToServeCount > 0 && (
              <Link
                href="/staff/orders"
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>{readyToServeCount} Ready to Serve</span>
              </Link>
            )}

            {billRequestedCount > 0 && (
              <Link
                href="/staff/billing"
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{billRequestedCount} Bill Due</span>
              </Link>
            )}

            <Link
              href="/"
              className="text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs hidden sm:inline-block transition-colors"
            >
              Public Site
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="max-w-7xl mx-auto hidden md:flex items-center gap-1 mt-2 pt-2 border-t border-zinc-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
                  isActive
                    ? 'bg-gray-50 text-gray-900 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Bar for one-hand operation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-40 px-2 py-1.5 flex justify-around items-center text-[10px] text-zinc-400">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 relative transition-colors ${
                isActive ? 'text-white font-bold' : 'hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && (
                  <span className={`absolute -top-1 -right-2 text-[9px] px-1 rounded-full text-white font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

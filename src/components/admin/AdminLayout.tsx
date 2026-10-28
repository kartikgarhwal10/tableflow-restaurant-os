'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  LayoutDashboard,
  ShoppingBag,
  Calculator,
  CalendarDays,
  Grid,
  UtensilsCrossed,
  Boxes,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Bell,
  Menu as MenuIcon,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { notifications, unreadNotifCount, activeStaff, restaurantConfig } = useTableflow();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The 11 core sidebar items requested in PRD
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'POS & Billing', href: '/admin/pos', icon: Calculator },
    { label: 'Reservations', href: '/admin/reservations', icon: CalendarDays },
    { label: 'Tables', href: '/admin/tables', icon: Grid },
    { label: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Staff', href: '/admin/staff', icon: UserCheck },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Secondary sub-sections for quick access without overloading the main nav
  const secondaryLinks = [
    { label: 'Expenses', href: '/admin/expenses' },
    { label: 'Suppliers', href: '/admin/suppliers' },
    { label: 'Shifts', href: '/admin/shifts' },
    { label: 'Audit Logs', href: '/admin/audit-logs' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-zinc-900 text-zinc-300 border-r border-zinc-800 shrink-0 sticky top-[33px] h-[calc(100vh-33px)] overflow-y-auto">
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-800">
          <Link href="/admin" className="block">
            <span className="text-[10px] font-mono font-semibold text-zinc-400 tracking-wider uppercase block">
              TableFlow OS &bull; Admin
            </span>
            <span className="text-base font-bold text-white tracking-tight">
              {restaurantConfig.name}
            </span>
            <span className="text-xs text-zinc-500 block">
              {restaurantConfig.city}, India
            </span>
          </Link>
        </div>

        {/* Primary Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-[#702B2B] text-white shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Compact Secondary Sections */}
          <div className="pt-4 mt-3 border-t border-zinc-800/80">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Secondary Modules
            </span>
            <div className="grid grid-cols-2 gap-1 px-1">
              {secondaryLinks.map((sec) => (
                <Link
                  key={sec.href}
                  href={sec.href}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                    pathname === sec.href
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  {sec.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#702B2B] flex items-center justify-center font-bold text-white text-[11px]">
              AS
            </div>
            <div>
              <div className="font-semibold text-white text-xs">Aditi Singhal</div>
              <div className="text-[10px] text-zinc-400">Restaurant Owner</div>
            </div>
          </div>
          <Link
            href="/"
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Open Public Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-[33px] z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded"
              aria-label="Toggle admin sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="text-xs text-gray-500">
              <span>TableFlow Restaurant Management Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pos"
              className="px-3 py-1.5 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded-md shadow-xs hidden sm:flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>POS Terminal</span>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="relative p-1.5 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              title="Audit Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#702B2B]" />
              )}
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 bg-zinc-900 text-zinc-300 flex flex-col z-10 h-full overflow-y-auto">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-base font-bold text-white">
                  {restaurantConfig.name}
                </span>
                <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1 text-xs">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-[#702B2B] text-white font-semibold'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-zinc-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="pt-3 mt-3 border-t border-zinc-800">
                  <span className="px-3 text-[10px] uppercase font-mono text-zinc-500 font-semibold block mb-1">
                    Secondary
                  </span>
                  {secondaryLinks.map((sec) => (
                    <Link
                      key={sec.href}
                      href={sec.href}
                      onClick={() => setSidebarOpen(false)}
                      className="block px-3 py-1.5 text-zinc-400 hover:text-white text-xs"
                    >
                      {sec.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

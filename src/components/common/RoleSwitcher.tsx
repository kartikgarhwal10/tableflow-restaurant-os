'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  Compass,
  UtensilsCrossed,
  ChefHat,
  LayoutDashboard,
  Bell,
  RotateCcw,
  ChevronDown,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function RoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentRole,
    setCurrentRole,
    activeStaff,
    orders,
    tables,
    unreadNotifCount,
    resetToDemoData,
    cart,
  } = useTableflow();

  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Computed metrics for status glance
  const pendingOrPrepOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length;
  const readyOrders = orders.filter((o) => o.status === 'ready').length;
  const billRequestedTables = tables.filter((t) => t.status === 'bill_requested').length;

  const handleRoleSelect = (role: 'customer' | 'waiter' | 'kitchen' | 'owner', targetRoute: string) => {
    setCurrentRole(role);
    router.push(targetRoute);
    setIsOpen(false);
  };

  const roles = [
    {
      id: 'customer',
      label: 'Visitor / Customer',
      route: '/',
      icon: Compass,
      desc: 'Public website, dining menu, online orders & table reservations',
      badge: cart.length > 0 ? `${cart.length} in cart` : undefined,
    },
    {
      id: 'waiter',
      label: 'Floor Waiter (Ravi)',
      route: '/staff/floor',
      icon: UtensilsCrossed,
      desc: 'Live floor plan, table occupancy, orders & instant billing',
      badge: readyOrders > 0 ? `${readyOrders} ready` : billRequestedTables > 0 ? `${billRequestedTables} bills` : undefined,
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'kitchen',
      label: 'Kitchen KDS (Chef Vikram)',
      route: '/kitchen/orders',
      icon: ChefHat,
      desc: 'Touch-optimized bump bar, station routing & prep timers',
      badge: pendingOrPrepOrders > 0 ? `${pendingOrPrepOrders} tickets` : undefined,
      badgeColor: 'bg-red-700',
    },
    {
      id: 'owner',
      label: 'Owner Dashboard (Aditi)',
      route: '/admin',
      icon: LayoutDashboard,
      desc: 'Sales analytics, recipe inventory, staff shifts & live POS',
      badge: 'Live ERP',
      badgeColor: 'bg-zinc-700',
    },
  ];

  const handleResetConfirm = async () => {
    setIsResetting(true);
    try {
      await resetToDemoData();
      setShowResetConfirm(false);
      setResetMessage('Demo environment reset successfully. All panels cleared.');
      setTimeout(() => setResetMessage(null), 4000);
      router.refresh();
    } catch {
      setResetMessage('Reset failed. Please try again.');
      setTimeout(() => setResetMessage(null), 4000);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      {/* Toast Alert */}
      {resetMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded shadow-lg text-xs font-medium border border-gray-700 flex items-center gap-2 animate-fade-in">
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Compact Demo Utility Toolbar */}
      <div className="bg-zinc-950 text-zinc-300 text-xs px-3 sm:px-4 py-1.5 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-semibold">
            Demo Environment
          </span>

          <span className="text-zinc-500 hidden md:inline text-[11px]">Role:</span>

          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive =
                (r.id === 'customer' && !pathname.startsWith('/staff') && !pathname.startsWith('/kitchen') && !pathname.startsWith('/admin')) ||
                (r.id === 'waiter' && pathname.startsWith('/staff')) ||
                (r.id === 'kitchen' && pathname.startsWith('/kitchen')) ||
                (r.id === 'owner' && pathname.startsWith('/admin'));

              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id as any, r.route)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label.split(' ')[0]}</span>
                  {r.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-700 text-zinc-200 font-mono">
                      {r.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side live glance and reset */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3 text-zinc-400 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Kitchen: <strong className="text-zinc-200">{pendingOrPrepOrders}</strong> active
            </span>
            <span className="inline-flex items-center gap-1">
              <UtensilsCrossed className="w-3 h-3 text-emerald-400" />
              Ready: <strong className="text-zinc-200">{readyOrders}</strong>
            </span>
            {cart.length > 0 && (
              <Link
                href="/cart"
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-white"
              >
                <ShoppingBag className="w-3 h-3" />
                Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
              </Link>
            )}
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset demo data for client presentation"
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Reset Demo Data for Client Presentation?
              </h3>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                This will clear all transactional and activity data across all panels so you can conduct a clean client demonstration.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-2">
              <div>
                <strong className="text-red-700 block mb-0.5">Cleared Data:</strong>
                <ul className="list-disc pl-4 text-gray-600 space-y-0.5">
                  <li>Active orders and order history</li>
                  <li>Kitchen tickets and bump bar queues</li>
                  <li>Waiter floor tasks and bill requests</li>
                  <li>Table reservations and guest bookings</li>
                  <li>Expenses and customer activity records</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <strong className="text-emerald-700 block mb-0.5">Preserved Configuration:</strong>
                <ul className="list-disc pl-4 text-gray-600 space-y-0.5">
                  <li>Restaurant branding, profile and operating hours</li>
                  <li>21 menu items, categories, recipes and prices</li>
                  <li>12 table seating layouts (reset to available)</li>
                  <li>Opening inventory stock and supplier contacts</li>
                  <li>Staff profiles and demo access PINs</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:bg-red-400 rounded transition-colors flex items-center gap-1.5"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Confirm & Reset Demo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTableflow } from '@/lib/store/tableflow-store';
import { ChefHat, Flame, Clock, Filter } from 'lucide-react';

export default function KDSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { orders, activeStaff } = useTableflow();

  // Metrics
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'accepted').length;
  const prepCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  const stations = [
    { id: 'all', label: 'All Stations', href: '/kitchen/orders' },
    { id: 'tandoor', label: 'Tandoor & Sigri', href: '/kitchen/stations/tandoor' },
    { id: 'curry', label: 'Curries & Handis', href: '/kitchen/stations/curry' },
    { id: 'breads', label: 'Breads & Dum Biryani', href: '/kitchen/stations/breads' },
    { id: 'desserts', label: 'Desserts & Halwai', href: '/kitchen/stations/desserts' },
    { id: 'bar', label: 'Bar & Chaas', href: '/kitchen/stations/bar' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Functional High-Contrast KDS Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 sticky top-[33px] z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#702B2B] flex items-center justify-center font-bold text-white shadow-xs">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-wide text-white uppercase font-mono">
                  Kitchen Display System (KDS)
                </h1>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  LIVE PASS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Chef: <strong className="text-zinc-200">{activeStaff?.name || 'Chef Vikram Rathore'}</strong> &bull; The Copper Table Kitchen
              </p>
            </div>
          </div>

          {/* Glances */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>New: <strong className="text-white text-sm">{pendingCount}</strong></span>
            </div>

            <div className="bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Cooking: <strong className="text-white text-sm">{prepCount}</strong></span>
            </div>

            <div className="bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Ready: <strong className="text-white text-sm">{readyCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Station Filters Row */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-2 mt-2 border-t border-zinc-800/80 scrollbar-none">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-zinc-400" /> Station:
          </span>
          {stations.map((s) => {
            const isActive = pathname === s.href;
            return (
              <Link
                key={s.id}
                href={s.href}
                className={`px-2.5 py-1 rounded text-xs font-mono tracking-wide font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#702B2B] text-white font-semibold shadow-xs'
                    : 'bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/60'
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main KDS Workspace */}
      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full">
        {children}
      </main>
    </div>
  );
}

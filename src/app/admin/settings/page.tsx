'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { restaurantConfig, updateRestaurantConfig, resetToDemoData } = useTableflow();

  const [form, setForm] = useState(restaurantConfig);
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await resetToDemoData();
      setShowResetConfirm(false);
      setResetMessage('Demo data reset successfully. All panels updated.');
      setTimeout(() => setResetMessage(null), 4000);
    } catch {
      setResetMessage('Reset failed. Please try again.');
      setTimeout(() => setResetMessage(null), 4000);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage restaurant profile, contact details, and tax configuration.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-md shadow-xs max-w-4xl space-y-6">
        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>Settings saved successfully. Changes are updated across the platform.</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Restaurant Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700 block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Contact & Hours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="sm:col-span-2">
              <label className="font-medium text-gray-700 block mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">City & State</label>
              <input
                type="text"
                value={`${form.city}, ${form.state}`}
                onChange={(e) => setForm({ ...form, city: e.target.value.split(',')[0]?.trim() || form.city })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">Opening Hours</label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Tax & Compliance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700 block mb-1">GSTIN</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded font-mono text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">FSSAI License</label>
              <input
                type="text"
                value={form.fssaiNumber}
                onChange={(e) => setForm({ ...form, fssaiNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded font-mono text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">CGST Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.cgstPercent}
                onChange={(e) => setForm({ ...form, cgstPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 block mb-1">SGST Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.sgstPercent}
                onChange={(e) => setForm({ ...form, sgstPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#702B2B] hover:bg-[#5C2323] text-white text-sm font-medium rounded flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>

      {/* Demo Environment Reset Section */}
      <div className="bg-white border border-gray-200 p-6 rounded-md shadow-xs max-w-4xl mt-6 space-y-4">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-base font-semibold text-gray-900">
            Client Demonstration Environment
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Provide a clean environment for client testing and demonstration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 border border-gray-200 rounded p-4 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-gray-900 block">
              Reset Transactional Data
            </span>
            <p className="text-gray-600 leading-relaxed max-w-lg">
              Clears all demo orders, kitchen queues, waiter bill requests, reservations, and expenses.
              Preserves restaurant settings, 21 menu dishes, 12 table definitions, recipes, and opening stock balances.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded shrink-0 transition-colors cursor-pointer"
          >
            Reset Demo Data
          </button>
        </div>

        {resetMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{resetMessage}</span>
          </div>
        )}
      </div>

      {/* Admin Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Confirm Demo Reset
              </h3>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                Are you sure you want to clear all transactional records? This action is intended for preparing a fresh client demonstration.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-2">
              <div>
                <strong className="text-red-700 block mb-0.5">Cleared:</strong>
                <span className="text-gray-600 block">All orders, tickets, reservations, expenses, and alerts.</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <strong className="text-emerald-700 block mb-0.5">Preserved:</strong>
                <span className="text-gray-600 block">Menu items, tables, staff, recipes, and inventory opening stock.</span>
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
                onClick={handleResetDemo}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:bg-red-400 rounded transition-colors"
              >
                {isResetting ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

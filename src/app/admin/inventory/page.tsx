'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { InventoryItem } from '@/types';
import { Search, X } from 'lucide-react';

export default function AdminInventoryPage() {
  const {
    inventory,
    stockMovements,
    adjustInventoryStock,
    recordWastage,
    recordPurchase,
  } = useTableflow();

  const [search, setSearch] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<{
    item: InventoryItem;
    mode: 'adjust' | 'waste' | 'purchase';
  } | null>(null);

  // Modal Inputs
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [modalReason, setModalReason] = useState<string>('Stock take reconciliation');

  // Valuation calculation
  const totalValuation = inventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitCost,
    0
  );
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;

    if (activeModalItem.mode === 'adjust') {
      adjustInventoryStock(activeModalItem.item.id, modalQuantity, modalReason);
    } else if (activeModalItem.mode === 'waste') {
      recordWastage(
        activeModalItem.item.id,
        modalQuantity,
        activeModalItem.item.unit,
        modalReason
      );
    } else if (activeModalItem.mode === 'purchase') {
      recordPurchase(
        activeModalItem.item.id,
        modalQuantity,
        activeModalItem.item.unitCost,
        activeModalItem.item.supplierId,
        `INV-${Date.now().toString().slice(-5)}`
      );
    }

    setActiveModalItem(null);
  };

  const filtered = inventory.filter((item) =>
    search ? item.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor stock levels, ingredient consumption, and supplier purchases
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-5 rounded">
          <span className="text-xs text-gray-500 font-medium">Total Inventory Value</span>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            ₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Calculated from purchase costs</p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded">
          <span className="text-xs text-gray-500 font-medium">Low Stock Items</span>
          <div className="text-2xl font-semibold text-amber-700 mt-1">
            {lowStockCount} <span className="text-sm font-normal text-gray-500">items</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Below minimum threshold</p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded">
          <span className="text-xs text-gray-500 font-medium">Stock Movement Records</span>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {stockMovements.length} <span className="text-sm font-normal text-gray-500">entries</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Automatic order deductions logged</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 p-4 rounded mb-6 flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredient (e.g. Paneer, Rice, Butter)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
          />
        </div>
      </div>

      {/* Inventory Catalog Table */}
      <div className="bg-white border border-gray-200 rounded overflow-x-auto mb-8">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Ingredient</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Current Stock</th>
              <th className="p-3.5">Min Threshold</th>
              <th className="p-3.5">Unit Cost</th>
              <th className="p-3.5">Supplier</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => {
              const isLow = item.currentStock <= item.minThreshold;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="p-3.5 capitalize text-gray-600">
                    {item.category.replace('_', ' ')}
                  </td>
                  <td className="p-3.5 font-semibold text-gray-900">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="p-3.5 text-gray-500">
                    {item.minThreshold} {item.unit}
                  </td>
                  <td className="p-3.5 text-gray-700">
                    ₹{item.unitCost} / {item.unit}
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {item.supplierName}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        isLow
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}
                    >
                      {isLow ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setActiveModalItem({ item, mode: 'adjust' });
                        setModalQuantity(item.currentStock);
                        setModalReason('Stock audit count');
                      }}
                      className="px-2 py-1 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      Adjust
                    </button>
                    <button
                      onClick={() => {
                        setActiveModalItem({ item, mode: 'waste' });
                        setModalQuantity(0.5);
                        setModalReason('Spoilage during prep');
                      }}
                      className="px-2 py-1 text-xs text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    >
                      Log Waste
                    </button>
                    <button
                      onClick={() => {
                        setActiveModalItem({ item, mode: 'purchase' });
                        setModalQuantity(10);
                        setModalReason('Received shipment');
                      }}
                      className="px-2 py-1 text-xs text-green-700 border border-green-300 rounded hover:bg-green-50 transition-colors"
                    >
                      + Receive
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Movements Audit Trail */}
      <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Recent Stock Movements
        </h2>

        {stockMovements.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">
            Recipe consumption deductions will be recorded here as orders are prepared.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 text-xs">
            {stockMovements.slice(0, 8).map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{m.ingredientName}</span>
                  <span className="text-gray-500 ml-2">({m.reason})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-medium ${
                      m.quantity < 0 ? 'text-red-700' : 'text-green-700'
                    }`}
                  >
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {new Date(m.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} &bull; {m.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjustment / Waste Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded shadow-lg border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h3 className="text-base font-semibold text-gray-900">
                {activeModalItem.mode === 'adjust'
                  ? 'Manual Stock Adjustment'
                  : activeModalItem.mode === 'waste'
                  ? 'Record Wastage'
                  : 'Receive Stock Purchase'}
              </h3>
              <button onClick={() => setActiveModalItem(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  Ingredient:
                </label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded font-medium text-gray-900">
                  {activeModalItem.item.name} (Current: {activeModalItem.item.currentStock} {activeModalItem.item.unit})
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  {activeModalItem.mode === 'adjust'
                    ? `New Absolute Stock (${activeModalItem.item.unit}):`
                    : activeModalItem.mode === 'waste'
                    ? `Wasted Quantity (${activeModalItem.item.unit}):`
                    : `Received Quantity (${activeModalItem.item.unit}):`}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={modalQuantity}
                  onChange={(e) => setModalQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  Reason / Note:
                </label>
                <input
                  type="text"
                  required
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  placeholder="E.g. Spoilage, count discrepancy..."
                  className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-3.5 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

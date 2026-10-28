'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { MenuItem } from '@/types';
import { Edit2, Check, X, Search } from 'lucide-react';

export default function AdminMenuPage() {
  const { menuItems, updateMenuItem, toggleMenuItemAvailability } = useTableflow();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const handleStartEdit = (dish: MenuItem) => {
    setEditingId(dish.id);
    setEditPrice(dish.price);
  };

  const handleSavePrice = (dish: MenuItem) => {
    updateMenuItem({
      ...dish,
      price: editPrice,
    });
    setEditingId(null);
  };

  const filtered = menuItems.filter((m) =>
    search ? m.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Menu Items
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage dish catalog, pricing, recipes, and stock availability
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
          />
        </div>
        <div className="text-xs text-gray-500 self-end sm:self-auto">
          Total Items: <strong className="text-gray-900">{menuItems.length}</strong>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Dish Name & Category</th>
              <th className="p-3.5">Station</th>
              <th className="p-3.5">Price</th>
              <th className="p-3.5">Recipe Ingredients</th>
              <th className="p-3.5">Availability</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((dish) => (
              <tr key={dish.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5 flex items-center gap-3">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-10 h-10 object-cover rounded bg-gray-100"
                  />
                  <div>
                    <span className="font-medium text-gray-900 block">
                      {dish.name}
                    </span>
                    <span className="text-[11px] text-gray-500 capitalize">
                      {dish.categoryId} &bull; {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                </td>

                <td className="p-3.5">
                  <span className="text-[11px] capitalize font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {dish.station}
                  </span>
                </td>

                <td className="p-3.5">
                  {editingId === dish.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-20 px-1.5 py-0.5 bg-white border border-[#702B2B] rounded text-xs font-semibold text-gray-900"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      ₹{dish.price}
                    </span>
                  )}
                </td>

                <td className="p-3.5 max-w-xs">
                  {dish.recipe && dish.recipe.length > 0 ? (
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {dish.recipe.map((r, i) => (
                        <span key={i} className="bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                          {r.quantity}{r.unit} {r.ingredientName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">None configured</span>
                  )}
                </td>

                <td className="p-3.5">
                  <button
                    onClick={() => toggleMenuItemAvailability(dish.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      dish.isAvailable
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {dish.isAvailable ? 'Available' : 'Sold Out'}
                  </button>
                </td>

                <td className="p-3.5 text-right">
                  {editingId === dish.id ? (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleSavePrice(dish)}
                        className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        title="Save Price"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(dish)}
                      className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      title="Edit Price"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

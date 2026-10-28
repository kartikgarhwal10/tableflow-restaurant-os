'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import { MenuItem } from '@/types';
import {
  Search,
  Plus,
  Check,
  ShoppingBag,
  Info,
  X,
  ArrowRight,
} from 'lucide-react';

export default function MenuPage() {
  const { menuItems, categories, cart, addToCart } = useTableflow();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg' | 'jain'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  // Customization modal state
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !item.isVeg) return false;
      if (dietaryFilter === 'non-veg' && item.isVeg) return false;
      if (dietaryFilter === 'jain' && !item.isJainAvailable) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesHindi = item.hindiName?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesDesc) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery]);

  const openCustomizeModal = (item: MenuItem) => {
    setActiveModalItem(item);
    setSelectedVariantId(item.variants?.[0]?.id);
    setSelectedAddonIds([]);
    setSpecialInstructions('');
    setQuantity(1);
  };

  const handleAddToCartFromModal = () => {
    if (!activeModalItem) return;
    addToCart(
      activeModalItem,
      quantity,
      selectedVariantId,
      selectedAddonIds,
      specialInstructions
    );
    setAddedItemNotification(activeModalItem.id);
    setActiveModalItem(null);
    setTimeout(() => setAddedItemNotification(null), 2000);
  };

  const handleDirectAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      openCustomizeModal(item);
    } else {
      addToCart(item, 1);
      setAddedItemNotification(item.id);
      setTimeout(() => setAddedItemNotification(null), 2000);
    }
  };

  // Modal price calculation
  const modalTotalPrice = useMemo(() => {
    if (!activeModalItem) return 0;
    let base = activeModalItem.price;
    if (selectedVariantId && activeModalItem.variants) {
      const variant = activeModalItem.variants.find((v) => v.id === selectedVariantId);
      if (variant) base += variant.priceDelta;
    }
    if (activeModalItem.addons) {
      for (const aid of selectedAddonIds) {
        const addon = activeModalItem.addons.find((a) => a.id === aid);
        if (addon) base += addon.price;
      }
    }
    return base * quantity;
  }, [activeModalItem, selectedVariantId, selectedAddonIds, quantity]);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartValue = cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Dining Menu
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Freshly prepared North Indian dishes, tandoori starters, slow-simmered handi gravies, and desserts.
          </p>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes or ingredients..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#702B2B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dietary Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto text-xs font-medium">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  dietaryFilter === 'all'
                    ? 'bg-gray-900 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 transition-colors ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 transition-colors ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-red-700 text-white font-semibold shadow-xs'
                    : 'bg-white text-red-800 hover:bg-red-50 border border-red-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-700 inline-block" />
                Non-Veg
              </button>
              <button
                onClick={() => setDietaryFilter('jain')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  dietaryFilter === 'jain'
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-300'
                }`}
              >
                Jain Option
              </button>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-gray-200 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
                selectedCategory === 'all'
                  ? 'bg-[#702B2B] text-white font-semibold'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All Courses ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-[#702B2B] text-white font-semibold'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <Info className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800 text-base mb-1">No items found</h3>
            <p className="text-xs text-gray-500 mb-4">Try clearing your search query or adjusting dietary filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDietaryFilter('all');
              }}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredItems.map((dish) => (
              <div
                key={dish.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-2.5 left-2.5 bg-white/95 p-1 rounded shadow-xs">
                      <span
                        className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                          dish.isVeg ? 'border-emerald-600' : 'border-red-700'
                        }`}
                        title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dish.isVeg ? 'bg-emerald-600' : 'bg-red-700'
                          }`}
                        />
                      </span>
                    </div>

                    {dish.isSpecial && (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold bg-gray-900 text-white px-2 py-0.5 rounded shadow-xs">
                        Chef Special
                      </span>
                    )}
                  </div>

                  {/* Dish Details */}
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <Link href={`/item/${dish.id}`} className="hover:text-[#702B2B] transition-colors">
                        <h3 className="font-semibold text-base text-gray-900 leading-snug">
                          {dish.name}
                        </h3>
                      </Link>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {dish.description}
                    </p>

                    <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span>Prep: ~{dish.preparationTimeMinutes} mins</span>
                      {dish.isJainAvailable && (
                        <span className="text-amber-700 font-medium">Jain Option Available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action & Price */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900 tabular-nums">
                    ₹{dish.price}
                  </span>

                  <button
                    onClick={() => handleDirectAdd(dish)}
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded transition-colors ${
                      addedItemNotification === dish.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#702B2B] hover:bg-[#5A2222] text-white shadow-xs'
                    }`}
                  >
                    {addedItemNotification === dish.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        {dish.variants && dish.variants.length > 0 ? 'Customize' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Cart Indicator Bar if items in cart */}
        {cart.length > 0 && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-full bg-gray-900 text-white p-3.5 rounded-lg shadow-xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#702B2B] flex items-center justify-center font-bold text-xs text-white">
                {totalCartCount}
              </div>
              <div>
                <div className="text-xs text-gray-300">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in your cart
                </div>
                <div className="text-sm font-bold text-white tabular-nums">
                  Subtotal: ₹{totalCartValue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Dish Customization Modal */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="absolute top-2.5 right-2.5 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2.5 left-4 text-white drop-shadow">
                  <h3 className="text-lg font-bold">{activeModalItem.name}</h3>
                  <span className="text-xs text-gray-200">₹{activeModalItem.price} base price</span>
                </div>
              </div>

              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
                {/* Variants Selection */}
                {activeModalItem.variants && activeModalItem.variants.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-900 block">
                      Choose Portion:
                    </label>
                    <div className="space-y-1.5">
                      {activeModalItem.variants.map((v) => (
                        <label
                          key={v.id}
                          className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors ${
                            selectedVariantId === v.id
                              ? 'border-[#702B2B] bg-red-50/40 font-semibold'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="variant"
                              value={v.id}
                              checked={selectedVariantId === v.id}
                              onChange={() => setSelectedVariantId(v.id)}
                              className="text-[#702B2B] focus:ring-[#702B2B]"
                            />
                            <span>{v.name}</span>
                          </div>
                          <span className="tabular-nums">
                            {v.priceDelta > 0 ? `+₹${v.priceDelta}` : 'Standard'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add-ons Selection */}
                {activeModalItem.addons && activeModalItem.addons.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-900 block">
                      Optional Add-ons:
                    </label>
                    <div className="space-y-1.5">
                      {activeModalItem.addons.map((addon) => {
                        const isChecked = selectedAddonIds.includes(addon.id);
                        return (
                          <label
                            key={addon.id}
                            className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors ${
                              isChecked
                                ? 'border-[#702B2B] bg-red-50/40 font-semibold'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAddonIds([...selectedAddonIds, addon.id]);
                                  } else {
                                    setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addon.id));
                                  }
                                }}
                                className="text-[#702B2B] focus:ring-[#702B2B] rounded"
                              />
                              <span>{addon.name}</span>
                            </div>
                            <span className="tabular-nums">+₹{addon.price}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Preparation Instructions */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-800 block">
                    Preparation Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Mild spice, extra lemon..."
                    className="w-full text-xs p-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-gray-800">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Bar */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Total</span>
                  <span className="text-base font-bold text-gray-900 tabular-nums">₹{modalTotalPrice}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddToCartFromModal}
                    className="px-4 py-1.5 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded shadow-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

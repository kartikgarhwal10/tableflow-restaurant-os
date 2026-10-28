'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  ArrowLeft,
  Flame,
  Clock,
  ShieldAlert,
  Check,
  ShoppingBag,
} from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const { menuItems, addToCart } = useTableflow();

  const dish = menuItems.find((m) => m.id === itemId);

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    dish?.variants?.[0]?.id
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!dish) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dish Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">The dish you are looking for is currently unavailable or does not exist.</p>
          <Link href="/menu" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#702B2B] text-white text-sm font-medium rounded hover:bg-[#592222] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate dynamic price
  let currentPrice = dish.price;
  if (selectedVariantId && dish.variants) {
    const v = dish.variants.find((item) => item.id === selectedVariantId);
    if (v) currentPrice += v.priceDelta;
  }
  if (dish.addons) {
    for (const aid of selectedAddonIds) {
      const a = dish.addons.find((item) => item.id === aid);
      if (a) currentPrice += a.price;
    }
  }
  const grandItemTotal = currentPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      dish,
      quantity,
      selectedVariantId,
      selectedAddonIds,
      specialInstructions
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      router.push('/cart');
    }, 700);
  };

  const relatedDishes = menuItems
    .filter((m) => m.categoryId === dish.categoryId && m.id !== dish.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#702B2B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        <div className="bg-white border border-gray-200 rounded p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Food Photograph */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded overflow-hidden border border-gray-200 h-80 sm:h-96 bg-gray-100">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  />
                  {dish.isVeg ? 'Veg' : 'Non-Veg'}
                </div>
              </div>

              {/* Recipe & inventory consumption details */}
              {dish.recipe && dish.recipe.length > 0 && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200 text-xs">
                  <div className="font-semibold text-gray-800 mb-2">
                    Ingredient Profile & Inventory Allocation
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-600">
                    {dish.recipe.map((r, i) => (
                      <div key={i} className="flex justify-between border-b border-gray-200 pb-1">
                        <span>{r.ingredientName}</span>
                        <span className="font-medium text-gray-900">{r.quantity} {r.unit}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    Ingredients are deducted from live inventory when the order is sent to the kitchen.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Dish Specs & Customization */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {dish.hindiName}
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                  {dish.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pb-4 border-b border-gray-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    ~{dish.preparationTimeMinutes} mins prep
                  </span>
                  {dish.spiceLevel && (
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Spice: {dish.spiceLevel}/3
                    </span>
                  )}
                  <span className="text-gray-600">
                    Station: <strong className="font-medium text-gray-900 capitalize">{dish.station}</strong>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {dish.description}
              </p>

              {/* Allergens warning */}
              {dish.allergens.length > 0 && (
                <div className="flex items-start gap-2 bg-amber-50 p-3 rounded border border-amber-200 text-xs text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium">Allergen Information:</strong>
                    Contains {dish.allergens.join(', ')}. Please inform staff if you have any severe food allergies.
                  </div>
                </div>
              )}

              {/* Variants Selector */}
              {dish.variants && dish.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Portion Size:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dish.variants.map((v) => (
                      <label
                        key={v.id}
                        className={`flex items-center justify-between p-3 rounded border text-xs cursor-pointer transition-colors ${
                          selectedVariantId === v.id
                            ? 'border-[#702B2B] bg-red-50/40 font-medium text-gray-900'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="detail-variant"
                            value={v.id}
                            checked={selectedVariantId === v.id}
                            onChange={() => setSelectedVariantId(v.id)}
                            className="text-[#702B2B] focus:ring-[#702B2B]"
                          />
                          <span>{v.name}</span>
                        </div>
                        <span>{v.priceDelta > 0 ? `+₹${v.priceDelta}` : 'Standard'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {dish.addons && dish.addons.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Add-ons:
                  </label>
                  <div className="space-y-2">
                    {dish.addons.map((addon) => {
                      const isChecked = selectedAddonIds.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-3 rounded border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-[#702B2B] bg-red-50/40 font-medium text-gray-900'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
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
                          <span>+₹{addon.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Preparation Notes */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-gray-900 block">
                  Kitchen Notes (Optional):
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="E.g., less spicy, no onions, extra crisp..."
                  rows={2}
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                />
              </div>

              {/* Quantity & Add to Cart button */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-gray-300 bg-white rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-medium text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="sm:hidden text-right">
                    <span className="text-[11px] text-gray-500 block">Total</span>
                    <span className="text-base font-semibold text-gray-900">₹{grandItemTotal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="hidden sm:block text-right">
                    <span className="text-[11px] text-gray-500 block">Total</span>
                    <span className="text-lg font-semibold text-gray-900">₹{grandItemTotal}</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded transition-colors ${
                      isAdded
                        ? 'bg-green-600 text-white'
                        : 'bg-[#702B2B] hover:bg-[#592222] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Dishes */}
        {relatedDishes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Similar Dishes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedDishes.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/item/${rel.id}`}
                  className="bg-white border border-gray-200 rounded p-4 flex gap-4 hover:border-gray-300 transition-colors"
                >
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-20 h-20 object-cover rounded bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 hover:text-[#702B2B] truncate">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {rel.description}
                    </p>
                    <span className="text-sm font-semibold text-gray-900 mt-2 block">
                      ₹{rel.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

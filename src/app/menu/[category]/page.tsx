'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import { ArrowLeft, Plus, Check } from 'lucide-react';

export default function CategoryMenuPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const { categories, menuItems, addToCart } = useTableflow();
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

  const category = categories.find((c) => c.slug === categorySlug);
  const items = menuItems.filter((i) => i.categoryId === category?.id);

  const handleAdd = (item: (typeof menuItems)[0]) => {
    addToCart(item, 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">The category you requested could not be located.</p>
          <Link href="/menu" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#702B2B] text-white text-sm font-medium rounded hover:bg-[#592222] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#702B2B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        {/* Category Header */}
        <div className="bg-white border border-gray-200 rounded p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-gray-500 mb-1">
              {category.hindiName}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              {category.name}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </div>
          <div className="text-sm text-gray-500 self-end md:self-center">
            {items.length} {items.length === 1 ? 'item' : 'items'} available
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {items.map((dish) => (
            <div
              key={dish.id}
              className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-100">
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

                <div className="p-5">
                  <div className="text-xs text-gray-500 mb-1">
                    {dish.hindiName}
                  </div>
                  <Link href={`/item/${dish.id}`}>
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 hover:text-[#702B2B] transition-colors">
                      {dish.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">₹{dish.price}</span>
                <button
                  onClick={() => handleAdd(dish)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    addedItem === dish.id
                      ? 'bg-green-600 text-white'
                      : 'bg-[#702B2B] hover:bg-[#592222] text-white'
                  }`}
                >
                  {addedItem === dish.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {addedItem === dish.id ? 'Added' : 'Add to Order'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

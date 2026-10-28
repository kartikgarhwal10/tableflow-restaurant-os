'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  CalendarDays,
  UtensilsCrossed,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Check,
  Plus,
} from 'lucide-react';

export default function HomePage() {
  const { menuItems, categories, addToCart } = useTableflow();
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

  // Popular dishes
  const popularDishes = menuItems.filter((item) => item.isSpecial).slice(0, 4);

  const handleQuickAdd = (item: (typeof menuItems)[0]) => {
    addToCart(item, 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gray-50 border-b border-gray-200 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#702B2B] bg-[#702B2B]/10 px-2.5 py-1 rounded">
                  Contemporary Indian Dining &bull; Jaipur
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                  Good Food. <br />
                  Thoughtfully Prepared.
                </h1>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                  Welcome to The Copper Table in C-Scheme, Jaipur. We serve traditional slow-simmered handi gravies, tandoor kebabs, and handcrafted desserts made fresh with authentic regional spices.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/menu"
                    className="px-6 py-3 bg-[#702B2B] hover:bg-[#5A2222] text-white text-sm font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>View Menu</span>
                  </Link>

                  <Link
                    href="/reservations"
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-sm font-semibold rounded-md transition-colors flex items-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span>Reserve a Table</span>
                  </Link>
                </div>

                {/* Quick Info Bar */}
                <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center gap-6 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>C-Scheme, Jaipur</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>Open Daily: 12 PM – 11:30 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>+91 141 238 9900</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-4/3 lg:aspect-square bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                    alt="The Copper Table restaurant dining room"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR DISHES */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Popular Dishes
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Guest favorites prepared with authentic spices and fresh local produce.
              </p>
            </div>
            <Link
              href="/menu"
              className="text-xs font-semibold text-[#702B2B] hover:text-[#5A2222] flex items-center gap-1"
            >
              <span>See Full Menu ({menuItems.length} dishes)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
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
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-base text-gray-900">
                    ₹{dish.price}
                  </span>

                  <button
                    onClick={() => handleQuickAdd(dish)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                      addedItem === dish.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#702B2B] hover:bg-[#5A2222] text-white'
                    }`}
                  >
                    {addedItem === dish.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MENU CATEGORIES */}
        <section className="py-14 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Menu Categories
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Explore our courses from sigri tandoor starters to fragrant handi curries and desserts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const count = menuItems.filter((i) => i.categoryId === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/menu/${cat.slug}`}
                    className="group bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between hover:border-gray-300 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#702B2B] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {count} {count === 1 ? 'dish' : 'dishes'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#702B2B] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESTAURANT INTRODUCTION */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#702B2B]">
                About The Restaurant
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                Traditional cooking techniques, fresh ingredients, and attentive service.
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Located in C-Scheme, Jaipur, <strong>The Copper Table</strong> offers contemporary Indian dining with deep roots in regional culinary craft. Our curries are slow-simmered in heavy-bottom vessels, our rotis are hand-stretched and clay-oven baked, and our spice blends are ground fresh.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Whether you join us for a weekday business lunch, family celebration, or order to enjoy at home, we prepare every dish with care and consistency.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#702B2B] hover:text-[#5A2222]"
                >
                  <span>Learn more about our kitchen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 h-64 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                  alt="Slow-cooked Dal Makhani"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 h-64 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
                  alt="Tandoor Sigri Murgh Tikka"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* RESERVATION CALL TO ACTION */}
        <section className="bg-gray-900 text-white py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Reserve Your Table
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
              We accept reservations for lunch and dinner. Choose your preferred dining area across our courtyard, indoor hall, or terrace.
            </p>
            <div className="pt-2">
              <Link
                href="/reservations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#702B2B] hover:bg-[#5A2222] text-white text-sm font-semibold rounded-md shadow-xs transition-colors"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Book a Table Online</span>
              </Link>
            </div>
          </div>
        </section>

        {/* HOURS & LOCATION */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <MapPin className="w-4 h-4 text-[#702B2B]" />
                <h3>Address & Location</h3>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                14, Royal Haveli Lane, Near Ahimsa Circle, C-Scheme, Jaipur, Rajasthan 302001
              </p>
              <p className="text-xs text-gray-500">Valet parking available.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Clock className="w-4 h-4 text-[#702B2B]" />
                <h3>Opening Hours</h3>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Lunch Service: 12:00 PM – 3:30 PM (Daily)<br />
                Dinner Service: 7:00 PM – 11:30 PM (Daily)
              </p>
              <p className="text-xs text-gray-500">Kitchen closes at 11:00 PM.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Phone className="w-4 h-4 text-[#702B2B]" />
                <h3>Contact & Enquiries</h3>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Direct Line: +91 141 238 9900<br />
                Email: concierge@thecoppertable.in
              </p>
              <p className="text-xs text-gray-500">For private events and banquets.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

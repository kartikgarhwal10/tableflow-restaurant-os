'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { ArrowRight, Utensils, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-14 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#702B2B]">
              About The Restaurant
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Our Story &amp; Kitchen Philosophy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
              Founded in C-Scheme, Jaipur, The Copper Table is committed to authentic regional Indian recipes, slow-cooking traditions, and warm hospitality.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#702B2B]">
                The Culinary Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                Traditional cooking techniques in the heart of Jaipur
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                In traditional North Indian kitchens, cooking vessels made of heavy copper and tin-lined brass were valued for their ability to distribute gentle, even heat. They allowed curries and gravies to simmer slowly, developing rich depths of flavor without burning delicate whole spices.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                At The Copper Table, we carry forward this tradition. Our chefs prepare daily batches of slow-simmered black lentils, braised mutton gravies, and fresh tandoori appetizers using time-tested methods and locally sourced ingredients.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-80 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                alt="Slow-cooking traditions at The Copper Table"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Sourcing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 relative rounded-lg overflow-hidden border border-gray-200 h-80 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"
                alt="Regional spice sourcing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#702B2B]">
                Ingredient Quality
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                Authentic spices and farm-fresh dairy
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Great dining begins with honest ingredients. Our signature dry red chillies are sourced directly from growers in Mathania, known for their aromatic warmth and deep natural color without artificial additives.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our dairy, including fresh paneer and pure ghee, comes from regional farms across Rajasthan, ensuring consistent freshness in every dish we serve.
              </p>
            </div>
          </div>

          {/* Chef Section */}
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
              alt="Head Chef Vikram Singh Rathore"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shrink-0"
            />
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#702B2B]">
                Head Chef
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Chef Vikram Singh Rathore
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Chef Vikram brings over two decades of culinary experience in North Indian regional cooking. His focus is on balanced spices, thoughtful food presentation, and recipes prepared from scratch every morning.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              <span>Reserve a Table</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

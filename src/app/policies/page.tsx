import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { ShieldCheck, HeartPulse, FileText, Clock } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Policies &amp; Standards
        </h1>
        <p className="text-gray-600 text-sm mb-8 border-b border-gray-200 pb-4">
          The Copper Table follows strict standards for food safety, reservations, and transparent billing.
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>FSSAI Hygiene &amp; Food Safety</span>
            </h2>
            <p>
              The Copper Table operates under Food Safety and Standards Authority of India (FSSAI) Central License No. <strong>12224026000189</strong>. Dairy, meats, poultry, and grains are sourced from certified and verified local suppliers.
            </p>
            <p>
              Drinking water served to guests undergoes comprehensive reverse osmosis (RO) filtration and UV sterilisation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#702B2B]" />
              <span>Allergen &amp; Dietary Preferences</span>
            </h2>
            <p>
              Our kitchen maintains separate prep areas and utensils for vegetarian and non-vegetarian cooking. Dishes marked as <em>Jain Available</em> are prepared strictly without onion, garlic, or root vegetables.
            </p>
            <p>
              Please let our floor staff know of any food allergies or dietary restrictions when placing your order.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span>Table Reservation Guidelines</span>
            </h2>
            <p>
              Reserved tables are held for up to 15 minutes past the booking time. Standard table dining intervals are scheduled for 90 minutes.
            </p>
            <p>
              Cancellations or rescheduling can be made free of charge up to 2 hours in advance via our website or telephone concierge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span>Pricing &amp; Applicable Taxes</span>
            </h2>
            <p>
              All prices are listed in Indian Rupees (₹). Under Indian GST regulations for restaurants, Goods &amp; Services Tax of 5% (2.5% CGST + 2.5% SGST) applies.
            </p>
            <p>
              Service charges are completely voluntary. Itemized tax invoices with full tax breakdowns are provided for all dine-in and online orders.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-200 text-xs text-gray-500">
            * TableFlow OS Demonstration Environment. Policies and records displayed for technology demonstration purposes.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

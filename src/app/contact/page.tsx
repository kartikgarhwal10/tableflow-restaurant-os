'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Contact &amp; Location
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Conveniently situated in C-Scheme, Jaipur. Complimentary valet parking is available for all dining guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Details & Location info */}
          <div className="md:col-span-5 space-y-5">
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg space-y-4 text-xs">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                Restaurant Information
              </h2>
              <div className="space-y-3.5 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#702B2B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">The Copper Table</strong>
                    <p className="text-gray-600 mt-0.5 leading-relaxed">
                      14, Royal Haveli Lane, Near Ahimsa Circle, C-Scheme, Jaipur, Rajasthan 302001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#702B2B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Phone &amp; WhatsApp</strong>
                    <p className="text-gray-600 mt-0.5">+91 141 238 9900</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#702B2B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Email Inquiries</strong>
                    <p className="text-gray-600 mt-0.5">concierge@thecoppertable.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#702B2B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Operating Hours</strong>
                    <p className="text-gray-600 mt-0.5">
                      Lunch: 12:00 PM – 3:30 PM<br />
                      Dinner: 7:00 PM – 11:30 PM (Daily)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
              <p><strong>FSSAI Lic:</strong> 12224026000189</p>
              <p><strong>GSTIN:</strong> 08AAACT9821R1Z3</p>
              <p className="text-gray-500 pt-1">Valet parking staff available at the entrance.</p>
            </div>
          </div>

          {/* Contact / Private Event Inquiry Form */}
          <div className="md:col-span-7 bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-lg space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
              Send an Inquiry or Message
            </h2>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">Message Received</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you. Our reception desk has received your message and will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#702B2B] border border-[#702B2B] rounded hover:bg-white"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 00000"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Message or Banquet Request *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share any questions about large table bookings, private dining, or dietary requests..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded shadow-xs transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

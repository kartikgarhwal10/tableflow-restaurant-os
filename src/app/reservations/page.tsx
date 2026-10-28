'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useTableflow } from '@/lib/store/tableflow-store';
import { TIME_SLOTS } from '@/lib/constants';
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function ReservationsPage() {
  const { createReservation, reservations, updateReservationStatus } = useTableflow();

  // Form State
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState('2026-10-29');
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[4]); // 07:00 PM default
  const [section, setSection] = useState<'courtyard' | 'indoor' | 'terrace'>('courtyard');
  const [customerName, setCustomerName] = useState('Maharani Gayatri Devi');
  const [customerPhone, setCustomerPhone] = useState('+91 98290 88776');
  const [customerEmail, setCustomerEmail] = useState('guest@example.com');
  const [occasion, setOccasion] = useState('Anniversary Celebration');
  const [specialRequests, setSpecialRequests] = useState('Fountain-facing table with floral welcome.');

  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'book' | 'lookup'>('book');

  // Lookup existing booking state
  const [lookupQuery, setLookupQuery] = useState('');
  const [foundBooking, setFoundBooking] = useState<any | null>(null);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setBookingResult(null);

    const res = createReservation({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      date: selectedDate,
      timeSlot: selectedTime,
      guestCount,
      section,
      occasion,
      specialRequests,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Requested slot is completely booked.');
    } else {
      setBookingResult(res.reservation);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupQuery.trim().toUpperCase();
    const found = reservations.find(
      (r) =>
        r.referenceCode.toUpperCase() === clean ||
        r.customerPhone.includes(clean) ||
        r.customerName.toLowerCase().includes(clean.toLowerCase())
    );
    setFoundBooking(found || 'NOT_FOUND');
  };

  const handleCancelBooking = (id: string) => {
    updateReservationStatus(id, 'cancelled');
    if (foundBooking && foundBooking !== 'NOT_FOUND') {
      setFoundBooking({ ...foundBooking, status: 'cancelled' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Table Reservations
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Reserve your dining table in our outdoor courtyard, indoor dining hall, or rooftop terrace.
          </p>

          {/* Tab Switcher: Book vs Lookup */}
          <div className="inline-flex p-1 bg-gray-100 rounded-md border border-gray-200 mt-5">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeTab === 'book'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Book a Table
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeTab === 'lookup'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Find Booking
            </button>
          </div>
        </div>

        {activeTab === 'book' ? (
          bookingResult ? (
            /* Booking Confirmation Card */
            <div className="max-w-md mx-auto bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Table Reserved Successfully
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  Ref #{bookingResult.referenceCode}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  A confirmation SMS has been simulated to {bookingResult.customerPhone}.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200 text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500">Guest Name:</span>
                  <strong className="text-gray-900">{bookingResult.customerName}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500">Date &amp; Time:</span>
                  <strong className="text-gray-900">{bookingResult.date} at {bookingResult.timeSlot}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500">Party Size:</span>
                  <strong className="text-gray-900">{bookingResult.guestCount} Guests</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dining Area:</span>
                  <strong className="capitalize text-gray-900">{bookingResult.section}</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setBookingResult(null)}
                  className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded hover:bg-black transition-colors"
                >
                  Book Another Table
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Date, Time & Ambiance */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Date & Guests */}
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3">
                  <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                    1. Party Size &amp; Date
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">
                        Guests:
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[1, 2, 4, 6, 8].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setGuestCount(num)}
                            className={`w-9 h-9 rounded font-semibold text-xs border transition-colors ${
                              guestCount === num
                                ? 'bg-[#702B2B] text-white border-[#702B2B]'
                                : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-800'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">
                        Date:
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Time Slot Selection */}
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3">
                  <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                    2. Time Slot
                  </h2>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 rounded border text-center font-medium transition-colors ${
                          selectedTime === slot
                            ? 'bg-[#702B2B] text-white border-[#702B2B] font-semibold'
                            : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    * Dining slots are reserved for 90 minutes. Overlapping bookings are prevented automatically.
                  </p>
                </div>

                {/* 3. Section / Ambiance Selection */}
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3">
                  <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                    3. Seating Area
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <label
                      className={`p-3.5 rounded border cursor-pointer transition-colors ${
                        section === 'courtyard'
                          ? 'border-[#702B2B] bg-white ring-1 ring-[#702B2B] font-semibold'
                          : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sec"
                        value="courtyard"
                        checked={section === 'courtyard'}
                        onChange={() => setSection('courtyard')}
                        className="sr-only"
                      />
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">Ground Floor</span>
                      <strong className="text-sm block text-gray-900 my-0.5">Courtyard</strong>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Open-air seating
                      </span>
                    </label>

                    <label
                      className={`p-3.5 rounded border cursor-pointer transition-colors ${
                        section === 'indoor'
                          ? 'border-[#702B2B] bg-white ring-1 ring-[#702B2B] font-semibold'
                          : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sec"
                        value="indoor"
                        checked={section === 'indoor'}
                        onChange={() => setSection('indoor')}
                        className="sr-only"
                      />
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">First Floor</span>
                      <strong className="text-sm block text-gray-900 my-0.5">Dining Hall</strong>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Indoor dining
                      </span>
                    </label>

                    <label
                      className={`p-3.5 rounded border cursor-pointer transition-colors ${
                        section === 'terrace'
                          ? 'border-[#702B2B] bg-white ring-1 ring-[#702B2B] font-semibold'
                          : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sec"
                        value="terrace"
                        checked={section === 'terrace'}
                        onChange={() => setSection('terrace')}
                        className="sr-only"
                      />
                      <span className="text-gray-500 block text-[10px] uppercase font-semibold">Rooftop</span>
                      <strong className="text-sm block text-gray-900 my-0.5">Terrace</strong>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Skyline views
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Guest Details & Confirmation */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-3.5">
                  <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                    4. Guest Details &amp; Notes
                  </h2>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Guest Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Vikramaditya Singh"
                        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98290 00000"
                        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="guest@example.com"
                        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Occasion</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                      >
                        <option>Anniversary Celebration</option>
                        <option>Birthday Banquet</option>
                        <option>Business Dinner</option>
                        <option>Family Gathering</option>
                        <option>Casual Dining</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Special Requests (Optional)</label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={2}
                        placeholder="e.g. Jain food requirements, quiet corner..."
                        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
                      />
                    </div>
                  </div>

                  {/* Summary Glance */}
                  <div className="bg-white p-3 rounded border border-gray-200 text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <strong className="text-gray-900">{selectedDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <strong className="text-gray-900">{selectedTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Party:</span>
                      <strong className="text-gray-900">{guestCount} Guests</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <strong className="capitalize text-gray-900">{section}</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#702B2B] hover:bg-[#5A2222] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Confirm Reservation</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant confirmation with conflict prevention</span>
                  </div>
                </div>
              </div>
            </form>
          )
        ) : (
          /* Lookup Existing Booking */
          <div className="max-w-xl mx-auto bg-gray-50 border border-gray-200 p-6 rounded-lg space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Find Your Reservation
              </h2>
              <p className="text-xs text-gray-500">
                Enter your reference code (e.g. CT-RES-101) or phone number
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                required
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Reference Code or Phone Number"
                className="flex-1 text-xs p-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#702B2B]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded hover:bg-black"
              >
                Search
              </button>
            </form>

            {foundBooking === 'NOT_FOUND' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                No reservation found for &quot;{lookupQuery}&quot;. Please verify your reference code or phone.
              </div>
            )}

            {foundBooking && foundBooking !== 'NOT_FOUND' && (
              <div className="p-4 bg-white border border-gray-200 rounded text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-mono text-gray-500 block">#{foundBooking.referenceCode}</span>
                    <strong className="text-sm text-gray-900">{foundBooking.customerName}</strong>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      foundBooking.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : foundBooking.status === 'seated'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {foundBooking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>Date: <strong className="text-gray-900">{foundBooking.date}</strong></div>
                  <div>Time: <strong className="text-gray-900">{foundBooking.timeSlot}</strong></div>
                  <div>Guests: <strong className="text-gray-900">{foundBooking.guestCount}</strong></div>
                  <div>Section: <strong className="capitalize text-gray-900">{foundBooking.section}</strong></div>
                </div>

                {foundBooking.status !== 'cancelled' && (
                  <div className="pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(foundBooking.id)}
                      className="px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

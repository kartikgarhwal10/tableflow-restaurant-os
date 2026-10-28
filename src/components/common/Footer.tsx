import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">
              The Copper Table
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Contemporary Indian dining in C-Scheme, Jaipur. Authentic regional handi curries, clay-oven tandoor specialties, and fresh confections.
            </p>
            <div className="pt-1 text-xs text-gray-500 space-y-0.5 font-mono">
              <p>GSTIN: 08AAACT9821R1Z3</p>
              <p>FSSAI Lic: 12224026000189</p>
            </div>
          </div>

          {/* Col 2: Hours */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200">
              Hours of Service
            </h3>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200 block">Lunch Service</strong>
                  <span>12:00 PM – 3:30 PM (Daily)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200 block">Dinner Service</strong>
                  <span>7:00 PM – 11:30 PM (Daily)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200">
              Location & Contact
            </h3>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                <span>14, Royal Haveli Lane, C-Scheme, Jaipur, Rajasthan 302001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <a href="tel:+911412389900" className="hover:text-white transition-colors">
                  +91 141 238 9900
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <a href="mailto:concierge@thecoppertable.in" className="hover:text-white transition-colors">
                  concierge@thecoppertable.in
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200">
              Management Portals
            </h3>
            <ul className="text-xs space-y-2 text-gray-400">
              <li>
                <Link href="/staff/floor" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Waiter & Floor Portal</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">Staff</span>
                </Link>
              </li>
              <li>
                <Link href="/kitchen/orders" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Kitchen Display (KDS)</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">KDS</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Owner Admin Dashboard</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">Admin</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/policies" className="hover:text-white transition-colors text-gray-500 block">
                  Policies & FSSAI Standards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>
            &copy; 2026 The Copper Table. Powered by TableFlow OS.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-center md:text-right">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Demonstration Environment &bull; Connected Multi-Role System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

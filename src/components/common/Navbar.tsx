'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTableflow } from '@/lib/store/tableflow-store';
import {
  ShoppingBag,
  CalendarDays,
  Menu as MenuIcon,
  X,
  Phone,
  MapPin,
  Utensils,
  User,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, restaurantConfig } = useTableflow();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-[33px] z-40">
      {/* Top micro-bar for location, hours & phone */}
      <div className="hidden md:flex justify-between items-center text-xs text-gray-600 px-6 py-1.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            C-Scheme, Jaipur, Rajasthan
          </span>
          <span className="text-gray-300">|</span>
          <span>Open Daily: 12:00 PM – 11:30 PM</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:+911412389900"
            className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gray-500" />
            +91 141 238 9900
          </a>
          <span className="text-gray-300">|</span>
          <Link href="/account" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
            <User className="w-3.5 h-3.5 text-gray-500" />
            My Account
          </Link>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 hover:text-[#702B2B] transition-colors">
            The Copper Table
          </span>
          <span className="text-[11px] text-gray-500 font-medium tracking-wide">
            Jaipur &bull; Contemporary Indian Dining
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#702B2B] font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#702B2B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/reservations"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors rounded-md"
          >
            <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
            Reserve a Table
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#702B2B] text-white hover:bg-[#5A2222] transition-colors rounded-md shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Online</span>
            {cartItemCount > 0 && (
              <span className="bg-white text-[#702B2B] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3">
          <div className="flex flex-col space-y-2 pb-3 border-b border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-800 hover:text-[#702B2B] py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800 pt-1"
            >
              My Account & Past Orders
            </Link>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-300 rounded-md"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

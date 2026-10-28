import { RestaurantConfig, Coupon } from '@/types';

export const DEFAULT_RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'The Copper Table',
  tagline: 'North Indian & Rajasthani Cuisine',
  address: '14, Royal Haveli Lane, C-Scheme',
  city: 'Jaipur',
  state: 'Rajasthan',
  pincode: '302001',
  phone: '+91 141 238 9900',
  email: 'info@thecoppertable.in',
  gstNumber: '08AAACT9821R1Z3',
  fssaiNumber: '12224026000189',
  currency: 'INR',
  currencySymbol: '₹',
  openingHours: '12:00 PM – 11:30 PM (Daily)',
  cgstPercent: 2.5,
  sgstPercent: 2.5,
  packagingChargeTakeaway: 30,
  deliveryFee: 50,
};

export const TIME_SLOTS = [
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'JAIPUR15',
    description: '15% off on orders above ₹800',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 800,
    maxDiscount: 350,
    validUntil: '2026-12-31',
  },
  {
    code: 'ROYAL200',
    description: 'Flat ₹200 off on dining above ₹1,200',
    discountType: 'fixed',
    discountValue: 200,
    minOrder: 1200,
    validUntil: '2026-12-31',
  },
  {
    code: 'COPPERFEST',
    description: '20% festive discount up to ₹500',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 1500,
    maxDiscount: 500,
    validUntil: '2026-12-31',
  },
];

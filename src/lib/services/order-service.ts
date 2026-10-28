import { Order, OrderItem, OrderType, OrderStatus, PaymentStatus, PaymentMethod } from '@/types';
import { DEFAULT_RESTAURANT_CONFIG, AVAILABLE_COUPONS } from '@/lib/constants';
import { INITIAL_MENU_ITEMS } from '@/lib/data/initial-data';

export interface PricingInputItem {
  menuItemId: string;
  quantity: number;
  selectedVariantId?: string;
  selectedAddonIds?: string[];
  specialInstructions?: string;
}

export interface CalculatedPricing {
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  cgst: number;
  sgst: number;
  packagingCharge: number;
  deliveryFee: number;
  total: number;
}

/**
 * Server-authoritative pricing calculation.
 * Never trust client prices or client totals!
 */
export function calculateOrderPricing(
  inputItems: PricingInputItem[],
  orderType: OrderType,
  couponCode?: string,
  customDiscount: number = 0
): CalculatedPricing {
  let subtotal = 0;
  const processedItems: OrderItem[] = [];

  for (const input of inputItems) {
    const menuItem = INITIAL_MENU_ITEMS.find((m) => m.id === input.menuItemId);
    if (!menuItem) continue;

    let unitPrice = menuItem.price;

    if (input.selectedVariantId && menuItem.variants) {
      const variant = menuItem.variants.find((v) => v.id === input.selectedVariantId);
      if (variant) {
        unitPrice += variant.priceDelta;
      }
    }

    if (input.selectedAddonIds && menuItem.addons) {
      for (const addonId of input.selectedAddonIds) {
        const addon = menuItem.addons.find((a) => a.id === addonId);
        if (addon) {
          unitPrice += addon.price;
        }
      }
    }

    const itemTotal = unitPrice * input.quantity;
    subtotal += itemTotal;

    processedItems.push({
      id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: unitPrice,
      quantity: input.quantity,
      selectedVariant: input.selectedVariantId,
      selectedAddons: input.selectedAddonIds,
      specialInstructions: input.specialInstructions,
      status: 'pending',
      station: menuItem.station,
      isVeg: menuItem.isVeg,
    });
  }

  // Coupon discount calculation
  let couponDiscount = 0;
  let appliedCoupon: string | undefined;

  if (couponCode) {
    const coupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );
    if (coupon && subtotal >= coupon.minOrder) {
      appliedCoupon = coupon.code;
      if (coupon.discountType === 'percentage') {
        const calculated = (subtotal * coupon.discountValue) / 100;
        couponDiscount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
      } else {
        couponDiscount = coupon.discountValue;
      }
    }
  }

  const totalDiscount = Math.min(subtotal, couponDiscount + customDiscount);
  const taxableAmount = Math.max(0, subtotal - totalDiscount);

  // Taxes: 2.5% CGST and 2.5% SGST (standard 5% restaurant GST in India)
  const cgst = Number(((taxableAmount * DEFAULT_RESTAURANT_CONFIG.cgstPercent) / 100).toFixed(2));
  const sgst = Number(((taxableAmount * DEFAULT_RESTAURANT_CONFIG.sgstPercent) / 100).toFixed(2));

  // Packaging and Delivery charges
  const packagingCharge =
    orderType === 'takeaway' || orderType === 'delivery'
      ? DEFAULT_RESTAURANT_CONFIG.packagingChargeTakeaway
      : 0;

  const deliveryFee =
    orderType === 'delivery' ? DEFAULT_RESTAURANT_CONFIG.deliveryFee : 0;

  const total = Number((taxableAmount + cgst + sgst + packagingCharge + deliveryFee).toFixed(2));

  return {
    items: processedItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(totalDiscount.toFixed(2)),
    appliedCoupon,
    cgst,
    sgst,
    packagingCharge,
    deliveryFee,
    total,
  };
}

/**
 * Valid order status transitions
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['served', 'completed', 'cancelled'],
  served: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

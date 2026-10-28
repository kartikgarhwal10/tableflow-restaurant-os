export type Role = 'customer' | 'waiter' | 'kitchen' | 'owner' | 'manager';

export type DiningSection = 'courtyard' | 'indoor' | 'terrace';

export type TableStatus = 'available' | 'reserved' | 'seated' | 'bill_requested' | 'cleaning';

export interface Table {
  id: string;
  number: string;
  name: string;
  section: DiningSection;
  capacity: number;
  status: TableStatus;
  activeOrderId?: string;
  activeReservationId?: string;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'partially_refunded'
  | 'refunded'
  | 'failed';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'simulated_card';

export type KitchenStation = 'all' | 'tandoor' | 'curry' | 'breads' | 'desserts' | 'bar';

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  isVeg: boolean;
  isJainAvailable?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 1 | 2 | 3;
  isSpecial?: boolean;
  isAvailable: boolean;
  imageUrl: string;
  allergens: string[];
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
  preparationTimeMinutes: number;
  station: KitchenStation;
  recipe?: RecipeIngredient[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  hindiName?: string;
  description: string;
  sortOrder: number;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number; // Snapshot at time of order
  quantity: number;
  selectedVariant?: string;
  selectedAddons?: string[];
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  station: KitchenStation;
  isVeg: boolean;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "CT-1042"
  type: OrderType;
  tableId?: string;
  tableNumber?: string;
  guestCount?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  items: OrderItem[];
  subtotal: number;
  cgst: number; // 2.5%
  sgst: number; // 2.5%
  packagingCharge: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  specialNotes?: string;
  createdAt: string;
  updatedAt: string;
  servedAt?: string;
  completedAt?: string;
  estimatedReadyMinutes?: number;
  timeline: OrderTimelineEvent[];
}

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  guestCount: number;
  section: DiningSection;
  tableId?: string;
  tableNumber?: string;
  specialRequests?: string;
  occasion?: string;
  status: ReservationStatus;
  createdAt: string;
}

export type InventoryCategory = 'dairy' | 'meat' | 'spices' | 'vegetables' | 'grains' | 'dry_goods' | 'beverages';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: 'g' | 'kg' | 'ml' | 'L' | 'pcs';
  currentStock: number;
  minThreshold: number;
  unitCost: number; // cost per unit in INR
  supplierId: string;
  supplierName: string;
  lastRestocked: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: InventoryCategory[];
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  ingredientName: string;
  type: 'order_consumption' | 'purchase_receipt' | 'wastage' | 'manual_adjustment';
  quantity: number;
  unit: string;
  orderId?: string;
  reason: string;
  timestamp: string;
  actor: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  pin: string;
  shift: string;
  avatar?: string;
  isActive: boolean;
}

export interface StaffShift {
  id: string;
  staffId: string;
  staffName: string;
  role: Role;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'scheduled' | 'completed';
  notes?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'ingredients' | 'utilities' | 'payroll' | 'marketing' | 'maintenance' | 'supplies';
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'paid' | 'pending';
  receiptNumber?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  type: 'order_new' | 'order_ready' | 'bill_requested' | 'reservation_new' | 'low_stock' | 'system';
  title: string;
  message: string;
  targetRole: 'all' | 'waiter' | 'kitchen' | 'owner';
  read: boolean;
  linkUrl?: string;
  orderId?: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstNumber: string;
  fssaiNumber: string;
  currency: string;
  currencySymbol: string;
  openingHours: string;
  cgstPercent: number;
  sgstPercent: number;
  packagingChargeTakeaway: number;
  deliveryFee: number;
}

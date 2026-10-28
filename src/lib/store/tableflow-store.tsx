'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Role,
  Table,
  Order,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  Reservation,
  ReservationStatus,
  InventoryItem,
  Supplier,
  StaffMember,
  StaffShift,
  Expense,
  AuditLog,
  AppNotification,
  MenuItem,
  MenuCategory,
  StockMovement,
  RestaurantConfig,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_STAFF,
  INITIAL_SUPPLIERS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_SHIFTS,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '@/lib/data/initial-data';
import { DEFAULT_RESTAURANT_CONFIG } from '@/lib/constants';
import { calculateOrderPricing, PricingInputItem } from '@/lib/services/order-service';
import { consumeInventoryForOrder } from '@/lib/services/inventory-service';
import { checkReservationAvailability } from '@/lib/services/reservation-service';

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
  selectedAddonIds?: string[];
  selectedAddonNames?: string[];
  specialInstructions?: string;
  unitPrice: number;
}

interface TableflowContextType {
  // Current session & role
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeStaff: StaffMember;
  setActiveStaff: (staff: StaffMember) => void;

  // Restaurant configuration
  restaurantConfig: RestaurantConfig;
  updateRestaurantConfig: (config: Partial<RestaurantConfig>) => void;

  // Data
  categories: MenuCategory[];
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  stockMovements: StockMovement[];
  staff: StaffMember[];
  shifts: StaffShift[];
  expenses: Expense[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  unreadNotifCount: number;

  // Cart
  cart: CartItem[];
  cartOrderType: OrderType;
  cartTableNumber: string;
  cartCouponCode: string;
  addToCart: (item: MenuItem, quantity?: number, variantId?: string, addonIds?: string[], instructions?: string) => void;
  updateCartItemQty: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  setCartOrderType: (type: OrderType) => void;
  setCartTableNumber: (tableNumber: string) => void;
  setCartCouponCode: (code: string) => void;
  cartSubtotal: number;
  cartCalculations: ReturnType<typeof calculateOrderPricing>;

  // Order Actions
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress?: string;
    specialNotes?: string;
    orderType?: OrderType;
    tableId?: string;
    tableNumber?: string;
    guestCount?: number;
    paymentMethod?: PaymentMethod;
    customDiscount?: number;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, actor?: string, note?: string) => void;
  updateOrderItemStatus: (orderId: string, orderItemId: string, status: 'pending' | 'preparing' | 'ready' | 'served') => void;
  requestTableBill: (tableId: string) => void;
  settlePayment: (orderId: string, paymentMethod: PaymentMethod, reference?: string) => void;

  // Reservation Actions
  createReservation: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    guestCount: number;
    section: 'courtyard' | 'indoor' | 'terrace';
    requestedTableId?: string;
    specialRequests?: string;
    occasion?: string;
  }) => { success: boolean; reservation?: Reservation; error?: string };
  updateReservationStatus: (reservationId: string, status: ReservationStatus, tableId?: string) => void;

  // Inventory & Menu Actions
  adjustInventoryStock: (ingredientId: string, newStock: number, reason: string) => void;
  recordWastage: (ingredientId: string, quantity: number, unit: string, reason: string) => void;
  recordPurchase: (ingredientId: string, quantity: number, unitCost: number, supplierId: string, invoiceNo: string) => void;
  updateMenuItem: (updatedItem: MenuItem) => void;
  toggleMenuItemAvailability: (menuItemId: string) => void;

  // Table Actions
  updateTableStatus: (tableId: string, status: Table['status']) => void;

  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  // Notifications & Audit
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addAuditLog: (action: string, entityType: string, entityId: string, details: string) => void;

  // Reset to clean demo environment
  resetToDemoData: () => Promise<{ success: boolean; error?: string }> | void;
}

const TableflowContext = createContext<TableflowContextType | null>(null);

const STORAGE_KEY_PREFIX = 'tableflow_os_v1_';

export function TableflowProvider({ children }: { children: React.ReactNode }) {
  // Role & Session
  const [currentRole, setCurrentRoleState] = useState<Role>('customer');
  const [activeStaff, setActiveStaffState] = useState<StaffMember>(INITIAL_STAFF[4]); // Ravi Kumar (Waiter) by default

  // Core State
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(DEFAULT_RESTAURANT_CONFIG);
  const [categories] = useState<MenuCategory[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [shifts] = useState<StaffShift[]>(INITIAL_SHIFTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOrderType, setCartOrderType] = useState<OrderType>('dine_in');
  const [cartTableNumber, setCartTableNumber] = useState<string>('T-01');
  const [cartCouponCode, setCartCouponCode] = useState<string>('');

  const [isClient, setIsClient] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedOrders = localStorage.getItem(`${STORAGE_KEY_PREFIX}orders`);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedTables = localStorage.getItem(`${STORAGE_KEY_PREFIX}tables`);
      if (savedTables) setTables(JSON.parse(savedTables));

      const savedReservations = localStorage.getItem(`${STORAGE_KEY_PREFIX}reservations`);
      if (savedReservations) setReservations(JSON.parse(savedReservations));

      const savedInventory = localStorage.getItem(`${STORAGE_KEY_PREFIX}inventory`);
      if (savedInventory) setInventory(JSON.parse(savedInventory));

      const savedMovements = localStorage.getItem(`${STORAGE_KEY_PREFIX}movements`);
      if (savedMovements) setStockMovements(JSON.parse(savedMovements));

      const savedNotifications = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      const savedAudit = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit`);
      if (savedAudit) setAuditLogs(JSON.parse(savedAudit));

      const savedCart = localStorage.getItem(`${STORAGE_KEY_PREFIX}cart`);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      if (savedRole) setCurrentRoleState(savedRole as Role);

      const savedMenuItems = localStorage.getItem(`${STORAGE_KEY_PREFIX}menu_items`);
      if (savedMenuItems) setMenuItems(JSON.parse(savedMenuItems));

      const savedExpenses = localStorage.getItem(`${STORAGE_KEY_PREFIX}expenses`);
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
  }, []);

  // BroadcastChannel for live cross-tab communication
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('tableflow_sync_channel');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'STATE_SYNC') {
          if (payload.orders) setOrders(payload.orders);
          if (payload.tables) setTables(payload.tables);
          if (payload.reservations) setReservations(payload.reservations);
          if (payload.inventory) setInventory(payload.inventory);
          if (payload.notifications) setNotifications(payload.notifications);
          if (payload.auditLogs) setAuditLogs(payload.auditLogs);
          if (payload.menuItems) setMenuItems(payload.menuItems);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    return () => {
      channel?.close();
    };
  }, []);

  // Sync helper to write to storage and broadcast
  const broadcastSync = useCallback(
    (updated: {
      orders?: Order[];
      tables?: Table[];
      reservations?: Reservation[];
      inventory?: InventoryItem[];
      notifications?: AppNotification[];
      auditLogs?: AuditLog[];
      menuItems?: MenuItem[];
      movements?: StockMovement[];
      expenses?: Expense[];
    }) => {
      if (typeof window === 'undefined') return;
      try {
        if (updated.orders) localStorage.setItem(`${STORAGE_KEY_PREFIX}orders`, JSON.stringify(updated.orders));
        if (updated.tables) localStorage.setItem(`${STORAGE_KEY_PREFIX}tables`, JSON.stringify(updated.tables));
        if (updated.reservations) localStorage.setItem(`${STORAGE_KEY_PREFIX}reservations`, JSON.stringify(updated.reservations));
        if (updated.inventory) localStorage.setItem(`${STORAGE_KEY_PREFIX}inventory`, JSON.stringify(updated.inventory));
        if (updated.notifications) localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(updated.notifications));
        if (updated.auditLogs) localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(updated.auditLogs));
        if (updated.menuItems) localStorage.setItem(`${STORAGE_KEY_PREFIX}menu_items`, JSON.stringify(updated.menuItems));
        if (updated.movements) localStorage.setItem(`${STORAGE_KEY_PREFIX}movements`, JSON.stringify(updated.movements));
        if (updated.expenses) localStorage.setItem(`${STORAGE_KEY_PREFIX}expenses`, JSON.stringify(updated.expenses));

        const channel = new BroadcastChannel('tableflow_sync_channel');
        channel.postMessage({ type: 'STATE_SYNC', payload: updated });
        channel.close();
      } catch (err) {
        console.error('Failed to sync to storage/channel', err);
      }
    },
    []
  );

  // Switch role & active staff
  const setCurrentRole = useCallback((role: Role) => {
    setCurrentRoleState(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
    }
    // Set appropriate demo staff profile
    if (role === 'owner') {
      setActiveStaffState(INITIAL_STAFF[0]); // Aditi Singhal
    } else if (role === 'manager') {
      setActiveStaffState(INITIAL_STAFF[1]); // Rajesh Sharma
    } else if (role === 'kitchen') {
      setActiveStaffState(INITIAL_STAFF[2]); // Chef Vikram
    } else if (role === 'waiter') {
      setActiveStaffState(INITIAL_STAFF[4]); // Ravi Kumar
    }
  }, []);

  const setActiveStaff = useCallback((member: StaffMember) => {
    setActiveStaffState(member);
    setCurrentRoleState(member.role);
  }, []);

  const updateRestaurantConfig = useCallback((newConfig: Partial<RestaurantConfig>) => {
    setRestaurantConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Notifications & Audit Log helpers
  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      broadcastSync({ notifications: updated });
      return updated;
    });
  }, [broadcastSync]);

  const addAuditLog = useCallback(
    (action: string, entityType: string, entityId: string, details: string) => {
      const newLog: AuditLog = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        actor: activeStaff?.name || 'Customer',
        role: currentRole,
        action,
        entityType,
        entityId,
        details,
      };
      setAuditLogs((prev) => {
        const updated = [newLog, ...prev.slice(0, 99)]; // retain latest 100
        broadcastSync({ auditLogs: updated });
        return updated;
      });
    },
    [activeStaff, currentRole, broadcastSync]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      broadcastSync({ notifications: updated });
      return updated;
    });
  }, [broadcastSync]);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      broadcastSync({ notifications: updated });
      return updated;
    });
  }, [broadcastSync]);

  // Cart Management
  const addToCart = useCallback(
    (
      item: MenuItem,
      quantity: number = 1,
      variantId?: string,
      addonIds?: string[],
      instructions?: string
    ) => {
      let unitPrice = item.price;
      let variantName: string | undefined;
      const addonNames: string[] = [];

      if (variantId && item.variants) {
        const variant = item.variants.find((v) => v.id === variantId);
        if (variant) {
          unitPrice += variant.priceDelta;
          variantName = variant.name;
        }
      }

      if (addonIds && item.addons) {
        for (const aid of addonIds) {
          const addon = item.addons.find((a) => a.id === aid);
          if (addon) {
            unitPrice += addon.price;
            addonNames.push(addon.name);
          }
        }
      }

      const cartItemId = `${item.id}-${variantId || 'base'}-${(addonIds || []).sort().join('-')}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((c) => c.cartItemId === cartItemId);
        let updated: CartItem[];
        if (existingIndex > -1) {
          updated = [...prev];
          updated[existingIndex].quantity += quantity;
        } else {
          updated = [
            ...prev,
            {
              cartItemId,
              menuItem: item,
              quantity,
              selectedVariantId: variantId,
              selectedVariantName: variantName,
              selectedAddonIds: addonIds,
              selectedAddonNames: addonNames,
              specialInstructions: instructions,
              unitPrice,
            },
          ];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}cart`, JSON.stringify(updated));
        }
        return updated;
      });
    },
    []
  );

  const updateCartItemQty = useCallback((cartItemId: string, newQty: number) => {
    setCart((prev) => {
      let updated: CartItem[];
      if (newQty <= 0) {
        updated = prev.filter((i) => i.cartItemId !== cartItemId);
      } else {
        updated = prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i));
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}cart`, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.cartItemId !== cartItemId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}cart`, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}cart`);
    }
  }, []);

  // Compute pricing
  const pricingInputItems: PricingInputItem[] = useMemo(() => {
    return cart.map((c) => ({
      menuItemId: c.menuItem.id,
      quantity: c.quantity,
      selectedVariantId: c.selectedVariantId,
      selectedAddonIds: c.selectedAddonIds,
      specialInstructions: c.specialInstructions,
    }));
  }, [cart]);

  const cartCalculations = useMemo(() => {
    return calculateOrderPricing(pricingInputItems, cartOrderType, cartCouponCode);
  }, [pricingInputItems, cartOrderType, cartCouponCode]);

  const cartSubtotal = cartCalculations.subtotal;

  // Order Placement
  const createOrder = useCallback(
    (orderData: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      deliveryAddress?: string;
      specialNotes?: string;
      orderType?: OrderType;
      tableId?: string;
      tableNumber?: string;
      guestCount?: number;
      paymentMethod?: PaymentMethod;
      customDiscount?: number;
    }) => {
      const type = orderData.orderType || cartOrderType;
      const pricing = calculateOrderPricing(
        pricingInputItems,
        type,
        cartCouponCode,
        orderData.customDiscount || 0
      );

      const nextNum = 1046 + orders.length;
      const orderNumber = `CT-${nextNum}`;
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        type,
        tableId: orderData.tableId,
        tableNumber: orderData.tableNumber || (type === 'dine_in' ? cartTableNumber : undefined),
        guestCount: orderData.guestCount,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        deliveryAddress: orderData.deliveryAddress,
        status: 'pending',
        paymentStatus: orderData.paymentMethod ? 'paid' : 'unpaid',
        paymentMethod: orderData.paymentMethod,
        paymentReference: orderData.paymentMethod ? `SIM-${Date.now().toString().slice(-6)}` : undefined,
        items: pricing.items,
        subtotal: pricing.subtotal,
        cgst: pricing.cgst,
        sgst: pricing.sgst,
        packagingCharge: pricing.packagingCharge,
        deliveryFee: pricing.deliveryFee,
        discountAmount: pricing.discountAmount,
        couponCode: pricing.appliedCoupon,
        total: pricing.total,
        specialNotes: orderData.specialNotes,
        createdAt: now,
        updatedAt: now,
        estimatedReadyMinutes: 20,
        timeline: [
          {
            status: 'pending',
            timestamp: now,
            actor: activeStaff?.name || 'Customer Online',
            note: 'Order submitted to system',
          },
        ],
      };

      // If dine-in, update table status to 'seated'
      let updatedTables = tables;
      if (type === 'dine_in') {
        const targetTable = tables.find(
          (t) => t.id === newOrder.tableId || t.number === newOrder.tableNumber
        );
        if (targetTable) {
          updatedTables = tables.map((t) =>
            t.id === targetTable.id
              ? { ...t, status: 'seated', activeOrderId: newOrder.id }
              : t
          );
          setTables(updatedTables);
        }
      }

      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);

      // Add Notification
      addNotification({
        type: 'order_new',
        title: `New ${type.toUpperCase()} Order #${orderNumber}`,
        message: `${orderData.customerName} placed order for ₹${pricing.total.toLocaleString('en-IN')}`,
        targetRole: 'all',
        orderId: newOrder.id,
      });

      // Audit Log
      addAuditLog('ORDER_CREATED', 'order', newOrder.id, `Order #${orderNumber} placed for ₹${pricing.total}`);

      // Clear cart
      clearCart();

      // Sync across tabs
      broadcastSync({ orders: updatedOrders, tables: updatedTables });

      return newOrder;
    },
    [
      cartOrderType,
      pricingInputItems,
      cartCouponCode,
      orders,
      cartTableNumber,
      activeStaff,
      tables,
      addNotification,
      addAuditLog,
      clearCart,
      broadcastSync,
    ]
  );

  // Update order status with recipe consumption and KDS synchronization
  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus, actor?: string, note?: string) => {
      const now = new Date().toISOString();
      const currentActor = actor || activeStaff?.name || 'Staff';

      let updatedInventory = inventory;
      let newMovements = stockMovements;

      setOrders((prevOrders) => {
        const orderIndex = prevOrders.findIndex((o) => o.id === orderId);
        if (orderIndex === -1) return prevOrders;

        const order = prevOrders[orderIndex];

        // RECIPE CONSUMPTION on transitioning to 'preparing'
        if (newStatus === 'preparing' && order.status !== 'preparing') {
          const consumption = consumeInventoryForOrder(order, inventory, menuItems, currentActor);
          updatedInventory = consumption.updatedInventory;
          newMovements = [...consumption.movements, ...stockMovements];
          setInventory(updatedInventory);
          setStockMovements(newMovements);

          // Alert on low stock items
          for (const item of consumption.lowStockItems) {
            addNotification({
              type: 'low_stock',
              title: `Low Stock Alert: ${item.name}`,
              message: `${item.name} stock has reached ${item.currentStock} ${item.unit} (Threshold: ${item.minThreshold} ${item.unit}).`,
              targetRole: 'owner',
            });
          }
        }

        // Notifications on status change
        if (newStatus === 'ready') {
          addNotification({
            type: 'order_ready',
            title: `Order #${order.orderNumber} is Ready!`,
            message: order.tableNumber
              ? `Ready for Table ${order.tableNumber}. Please deliver to guests.`
              : `Order for ${order.customerName} is packed and ready.`,
            targetRole: 'waiter',
            orderId: order.id,
          });
        }

        const updatedOrder: Order = {
          ...order,
          status: newStatus,
          updatedAt: now,
          servedAt: newStatus === 'served' ? now : order.servedAt,
          completedAt: newStatus === 'completed' ? now : order.completedAt,
          timeline: [
            ...order.timeline,
            {
              status: newStatus,
              timestamp: now,
              actor: currentActor,
              note: note || `Status updated to ${newStatus}`,
            },
          ],
        };

        const updatedList = [...prevOrders];
        updatedList[orderIndex] = updatedOrder;

        // If completed or cancelled, handle table status
        let updatedTablesList = tables;
        if ((newStatus === 'completed' || newStatus === 'cancelled') && order.tableId) {
          updatedTablesList = tables.map((t) =>
            t.id === order.tableId
              ? { ...t, status: newStatus === 'completed' ? 'cleaning' : 'available', activeOrderId: undefined }
              : t
          );
          setTables(updatedTablesList);
        }

        addAuditLog(
          `ORDER_STATUS_${newStatus.toUpperCase()}`,
          'order',
          order.id,
          `Order #${order.orderNumber} moved to ${newStatus} by ${currentActor}`
        );

        broadcastSync({
          orders: updatedList,
          tables: updatedTablesList,
          inventory: updatedInventory,
          movements: newMovements,
        });

        return updatedList;
      });
    },
    [activeStaff, inventory, stockMovements, menuItems, tables, addNotification, addAuditLog, broadcastSync]
  );

  // Per-item status inside KDS
  const updateOrderItemStatus = useCallback(
    (orderId: string, orderItemId: string, status: 'pending' | 'preparing' | 'ready' | 'served') => {
      setOrders((prev) => {
        const order = prev.find((o) => o.id === orderId);
        if (!order) return prev;

        const updatedItems = order.items.map((i) =>
          i.id === orderItemId ? { ...i, status } : i
        );

        // Check if all items are ready
        const allReady = updatedItems.every((i) => i.status === 'ready' || i.status === 'served');
        const nextOrderStatus = allReady && order.status === 'preparing' ? 'ready' : order.status;

        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          status: nextOrderStatus,
          updatedAt: new Date().toISOString(),
        };

        const updatedList = prev.map((o) => (o.id === orderId ? updatedOrder : o));
        broadcastSync({ orders: updatedList });
        return updatedList;
      });
    },
    [broadcastSync]
  );

  // Request bill for a table
  const requestTableBill = useCallback(
    (tableId: string) => {
      setTables((prev) => {
        const target = prev.find((t) => t.id === tableId);
        if (!target) return prev;

        const updated = prev.map((t) =>
          t.id === tableId ? { ...t, status: 'bill_requested' as const } : t
        );

        addNotification({
          type: 'bill_requested',
          title: `Bill Requested: Table ${target.number}`,
          message: `Guests at ${target.name} requested final bill settlement.`,
          targetRole: 'waiter',
        });

        addAuditLog('BILL_REQUESTED', 'table', target.id, `Bill requested for Table ${target.number}`);
        broadcastSync({ tables: updated });
        return updated;
      });
    },
    [addNotification, addAuditLog, broadcastSync]
  );

  // Settle bill / payment
  const settlePayment = useCallback(
    (orderId: string, paymentMethod: PaymentMethod, reference?: string) => {
      const now = new Date().toISOString();
      setOrders((prevOrders) => {
        const order = prevOrders.find((o) => o.id === orderId);
        if (!order) return prevOrders;

        const updatedOrder: Order = {
          ...order,
          paymentStatus: 'paid',
          paymentMethod,
          paymentReference: reference || `SIM-${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`,
          status: 'completed',
          completedAt: now,
          updatedAt: now,
          timeline: [
            ...order.timeline,
            {
              status: 'completed',
              timestamp: now,
              actor: activeStaff?.name || 'Cashier',
              note: `Payment settled via ${paymentMethod.toUpperCase()} (Ref: ${reference || 'Simulated'})`,
            },
          ],
        };

        const updatedOrders = prevOrders.map((o) => (o.id === orderId ? updatedOrder : o));

        // Free table to 'cleaning'
        let updatedTables = tables;
        if (order.tableId) {
          updatedTables = tables.map((t) =>
            t.id === order.tableId ? { ...t, status: 'cleaning', activeOrderId: undefined } : t
          );
          setTables(updatedTables);
        }

        addAuditLog(
          'PAYMENT_SETTLED',
          'order',
          order.id,
          `Payment of ₹${order.total} received via ${paymentMethod} for Order #${order.orderNumber}`
        );

        broadcastSync({ orders: updatedOrders, tables: updatedTables });
        return updatedOrders;
      });
    },
    [activeStaff, tables, addAuditLog, broadcastSync]
  );

  // Reservation Actions
  const createReservation = useCallback(
    (data: {
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      date: string;
      timeSlot: string;
      guestCount: number;
      section: 'courtyard' | 'indoor' | 'terrace';
      requestedTableId?: string;
      specialRequests?: string;
      occasion?: string;
    }) => {
      // Validate availability and capacity
      const check = checkReservationAvailability(
        reservations,
        tables,
        data.date,
        data.timeSlot,
        data.guestCount,
        data.requestedTableId
      );

      if (!check.isAvailable) {
        return { success: false, error: check.errorMessage || 'Time slot is unavailable.' };
      }

      const assignedTable = check.assignedTable;
      const refCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        referenceCode: refCode,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        date: data.date,
        timeSlot: data.timeSlot,
        guestCount: data.guestCount,
        section: data.section,
        tableId: assignedTable?.id,
        tableNumber: assignedTable?.number,
        specialRequests: data.specialRequests,
        occasion: data.occasion,
        status: 'confirmed',
        createdAt: now,
      };

      const updatedReservations = [newReservation, ...reservations];
      setReservations(updatedReservations);

      addNotification({
        type: 'reservation_new',
        title: `New Reservation #${refCode}`,
        message: `${data.customerName} booked for ${data.guestCount} guests on ${data.date} at ${data.timeSlot} (${assignedTable ? 'Table ' + assignedTable.number : data.section})`,
        targetRole: 'all',
      });

      addAuditLog(
        'RESERVATION_CREATED',
        'reservation',
        newReservation.id,
        `Reservation ${refCode} booked for ${data.customerName}`
      );

      broadcastSync({ reservations: updatedReservations });
      return { success: true, reservation: newReservation };
    },
    [reservations, tables, addNotification, addAuditLog, broadcastSync]
  );

  const updateReservationStatus = useCallback(
    (reservationId: string, status: ReservationStatus, tableId?: string) => {
      setReservations((prev) => {
        const target = prev.find((r) => r.id === reservationId);
        if (!target) return prev;

        const updated = prev.map((r) =>
          r.id === reservationId
            ? { ...r, status, tableId: tableId || r.tableId }
            : r
        );

        // If seated, mark table seated
        let updatedTables = tables;
        const assignedId = tableId || target.tableId;
        if (status === 'seated' && assignedId) {
          updatedTables = tables.map((t) =>
            t.id === assignedId
              ? { ...t, status: 'seated', activeReservationId: reservationId }
              : t
          );
          setTables(updatedTables);
        } else if (status === 'completed' && assignedId) {
          updatedTables = tables.map((t) =>
            t.id === assignedId && t.activeReservationId === reservationId
              ? { ...t, activeReservationId: undefined }
              : t
          );
          setTables(updatedTables);
        }

        addAuditLog('RESERVATION_STATUS', 'reservation', reservationId, `Status changed to ${status}`);
        broadcastSync({ reservations: updated, tables: updatedTables });
        return updated;
      });
    },
    [tables, addAuditLog, broadcastSync]
  );

  // Table status direct update
  const updateTableStatus = useCallback(
    (tableId: string, status: Table['status']) => {
      setTables((prev) => {
        const updated = prev.map((t) => (t.id === tableId ? { ...t, status } : t));
        broadcastSync({ tables: updated });
        return updated;
      });
    },
    [broadcastSync]
  );

  // Inventory actions
  const adjustInventoryStock = useCallback(
    (ingredientId: string, newStock: number, reason: string) => {
      setInventory((prev) => {
        const item = prev.find((i) => i.id === ingredientId);
        if (!item) return prev;
        const diff = newStock - item.currentStock;

        const updated = prev.map((i) =>
          i.id === ingredientId ? { ...i, currentStock: newStock } : i
        );

        const movement: StockMovement = {
          id: `mov-${Date.now()}`,
          ingredientId,
          ingredientName: item.name,
          type: 'manual_adjustment',
          quantity: diff,
          unit: item.unit,
          reason,
          timestamp: new Date().toISOString(),
          actor: activeStaff?.name || 'Admin',
        };

        const updatedMovements = [movement, ...stockMovements];
        setStockMovements(updatedMovements);

        broadcastSync({ inventory: updated, movements: updatedMovements });
        return updated;
      });
    },
    [activeStaff, stockMovements, broadcastSync]
  );

  const recordWastage = useCallback(
    (ingredientId: string, quantity: number, unit: string, reason: string) => {
      setInventory((prev) => {
        const item = prev.find((i) => i.id === ingredientId);
        if (!item) return prev;

        const newStock = Math.max(0, Number((item.currentStock - quantity).toFixed(3)));
        const updated = prev.map((i) => (i.id === ingredientId ? { ...i, currentStock: newStock } : i));

        const movement: StockMovement = {
          id: `mov-${Date.now()}`,
          ingredientId,
          ingredientName: item.name,
          type: 'wastage',
          quantity: -quantity,
          unit,
          reason: `Wastage: ${reason}`,
          timestamp: new Date().toISOString(),
          actor: activeStaff?.name || 'Chef',
        };

        const updatedMovements = [movement, ...stockMovements];
        setStockMovements(updatedMovements);

        addAuditLog('INVENTORY_WASTAGE', 'inventory', ingredientId, `Logged wastage of ${quantity} ${unit} for ${item.name}`);
        broadcastSync({ inventory: updated, movements: updatedMovements });
        return updated;
      });
    },
    [activeStaff, stockMovements, addAuditLog, broadcastSync]
  );

  const recordPurchase = useCallback(
    (ingredientId: string, quantity: number, unitCost: number, supplierId: string, invoiceNo: string) => {
      setInventory((prev) => {
        const item = prev.find((i) => i.id === ingredientId);
        if (!item) return prev;

        const newStock = Number((item.currentStock + quantity).toFixed(3));
        const updated = prev.map((i) =>
          i.id === ingredientId
            ? { ...i, currentStock: newStock, unitCost, lastRestocked: new Date().toISOString().slice(0, 10) }
            : i
        );

        const movement: StockMovement = {
          id: `mov-${Date.now()}`,
          ingredientId,
          ingredientName: item.name,
          type: 'purchase_receipt',
          quantity,
          unit: item.unit,
          reason: `Purchase Received (Inv #${invoiceNo})`,
          timestamp: new Date().toISOString(),
          actor: activeStaff?.name || 'Store Manager',
        };

        const updatedMovements = [movement, ...stockMovements];
        setStockMovements(updatedMovements);

        broadcastSync({ inventory: updated, movements: updatedMovements });
        return updated;
      });
    },
    [activeStaff, stockMovements, broadcastSync]
  );

  // Menu item modification
  const updateMenuItem = useCallback(
    (updatedItem: MenuItem) => {
      setMenuItems((prev) => {
        const updated = prev.map((m) => (m.id === updatedItem.id ? updatedItem : m));
        broadcastSync({ menuItems: updated });
        return updated;
      });
    },
    [broadcastSync]
  );

  const toggleMenuItemAvailability = useCallback(
    (menuItemId: string) => {
      setMenuItems((prev) => {
        const updated = prev.map((m) =>
          m.id === menuItemId ? { ...m, isAvailable: !m.isAvailable } : m
        );
        broadcastSync({ menuItems: updated });
        return updated;
      });
    },
    [broadcastSync]
  );

  // Expense addition
  const addExpense = useCallback(
    (expenseData: Omit<Expense, 'id'>) => {
      const newExpense: Expense = {
        ...expenseData,
        id: `exp-${Date.now()}`,
      };
      setExpenses((prev) => {
        const updated = [newExpense, ...prev];
        broadcastSync({ expenses: updated });
        return updated;
      });
      addAuditLog('EXPENSE_ADDED', 'expense', newExpense.id, `Added expense ₹${newExpense.amount} for ${newExpense.description}`);
    },
    [addAuditLog, broadcastSync]
  );

  // Reset to clean demo state for client testing
  const resetToDemoData = useCallback(async () => {
    try {
      await fetch('/api/admin/reset-demo', { method: 'POST' }).catch(() => {});
    } catch {
      // Fallback to local cleanup
    }

    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(k);
        }
      }
    }
    setOrders(INITIAL_ORDERS);
    setTables(INITIAL_TABLES);
    setReservations(INITIAL_RESERVATIONS);
    setInventory(INITIAL_INVENTORY);
    setStockMovements([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMenuItems(INITIAL_MENU_ITEMS);
    setExpenses(INITIAL_EXPENSES);
    setCart([]);
    setCurrentRole('customer');

    broadcastSync({
      orders: INITIAL_ORDERS,
      tables: INITIAL_TABLES,
      reservations: INITIAL_RESERVATIONS,
      inventory: INITIAL_INVENTORY,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      menuItems: INITIAL_MENU_ITEMS,
      expenses: INITIAL_EXPENSES,
    });

    return { success: true };
  }, [broadcastSync, setCurrentRole]);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <TableflowContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeStaff,
        setActiveStaff,
        restaurantConfig,
        updateRestaurantConfig,
        categories,
        menuItems,
        tables,
        orders,
        reservations,
        inventory,
        suppliers,
        stockMovements,
        staff,
        shifts,
        expenses,
        auditLogs,
        notifications,
        unreadNotifCount,
        cart,
        cartOrderType,
        cartTableNumber,
        cartCouponCode,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        setCartOrderType,
        setCartTableNumber,
        setCartCouponCode,
        cartSubtotal,
        cartCalculations,
        createOrder,
        updateOrderStatus,
        updateOrderItemStatus,
        requestTableBill,
        settlePayment,
        createReservation,
        updateReservationStatus,
        adjustInventoryStock,
        recordWastage,
        recordPurchase,
        updateMenuItem,
        toggleMenuItemAvailability,
        updateTableStatus,
        addExpense,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAuditLog,
        resetToDemoData,
      }}
    >
      {children}
    </TableflowContext.Provider>
  );
}

export function useTableflow() {
  const context = useContext(TableflowContext);
  if (!context) {
    throw new Error('useTableflow must be used within TableflowProvider');
  }
  return context;
}

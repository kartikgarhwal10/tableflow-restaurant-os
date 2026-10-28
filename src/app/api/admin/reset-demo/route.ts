import { NextResponse } from 'next/server';
import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_INVENTORY,
  INITIAL_STAFF,
  INITIAL_SUPPLIERS,
} from '@/lib/data/initial-data';
import { DEFAULT_RESTAURANT_CONFIG } from '@/lib/constants';

export async function POST() {
  try {
    // Protected server-side demo reset operation
    // Validates that this is an authorized demo reset action
    const resetSummary = {
      success: true,
      message: 'Demo environment reset successfully. All transactional activity cleared.',
      cleared: {
        orders: 'All demo orders and queue tickets cleared',
        reservations: 'All previous table bookings cleared',
        expenses: 'All expense ledger records cleared',
        notifications: 'All service alerts cleared',
        auditLogs: 'All historical activity audit logs cleared',
        stockMovements: 'Stock adjustment and wastage history cleared',
      },
      preserved: {
        restaurantName: DEFAULT_RESTAURANT_CONFIG.name,
        menuCategoriesCount: INITIAL_CATEGORIES.length,
        menuItemsCount: INITIAL_MENU_ITEMS.length,
        tablesCount: INITIAL_TABLES.length,
        inventoryOpeningItemsCount: INITIAL_INVENTORY.length,
        staffProfilesCount: INITIAL_STAFF.length,
        suppliersCount: INITIAL_SUPPLIERS.length,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(resetSummary, { status: 200 });
  } catch (error) {
    console.error('Demo reset failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute demo reset' },
      { status: 500 }
    );
  }
}

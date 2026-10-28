import { Order, InventoryItem, MenuItem, StockMovement } from '@/types';

export interface ConsumptionResult {
  updatedInventory: InventoryItem[];
  movements: StockMovement[];
  lowStockItems: InventoryItem[];
}

/**
 * Calculates and deducts recipe ingredient consumption for an order.
 * Follows restaurant inventory best practices:
 * E.g., If 1 serving of Paneer Lababdar consumes 160g paneer, 2 servings consume 320g.
 */
export function consumeInventoryForOrder(
  order: Order,
  currentInventory: InventoryItem[],
  menuItems: MenuItem[],
  actorName: string = 'Kitchen Auto-Deduction'
): ConsumptionResult {
  const inventoryMap = new Map<string, InventoryItem>(
    currentInventory.map((item) => [item.id, { ...item }])
  );
  const movements: StockMovement[] = [];
  const lowStockItems: InventoryItem[] = [];

  for (const orderItem of order.items) {
    const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId);
    if (!menuItem || !menuItem.recipe) continue;

    for (const recipeIng of menuItem.recipe) {
      const invItem = inventoryMap.get(recipeIng.ingredientId);
      if (!invItem) continue;

      // Convert gram/ml to kg/L if inventory item unit is in kg or L
      let consumedQty = recipeIng.quantity * orderItem.quantity;
      if ((invItem.unit === 'kg' || invItem.unit === 'L') && (recipeIng.unit === 'g' || recipeIng.unit === 'ml')) {
        consumedQty = consumedQty / 1000;
      }

      // Deduct stock
      const previousStock = invItem.currentStock;
      const newStock = Math.max(0, Number((previousStock - consumedQty).toFixed(3)));
      invItem.currentStock = newStock;

      // Record stock movement
      movements.push({
        id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ingredientId: invItem.id,
        ingredientName: invItem.name,
        type: 'order_consumption',
        quantity: -consumedQty,
        unit: invItem.unit,
        orderId: order.id,
        reason: `Consumed for Order #${order.orderNumber} (${orderItem.quantity}x ${orderItem.name})`,
        timestamp: new Date().toISOString(),
        actor: actorName,
      });

      // Check if threshold breached
      if (newStock <= invItem.minThreshold && previousStock > invItem.minThreshold) {
        lowStockItems.push(invItem);
      }
    }
  }

  return {
    updatedInventory: Array.from(inventoryMap.values()),
    movements,
    lowStockItems,
  };
}

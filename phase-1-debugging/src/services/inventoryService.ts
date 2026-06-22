import prisma from "../lib/prisma";
import { subscribe } from "../lib/eventBus";
import { getCachedOrder } from "../cache/orderCache";

export async function getInventory(productId: string) {
  const inventory = await prisma.inventory.findUniqueOrThrow({
    where: { productId },
    include: { product: true },
  });

  return {
    productId: inventory.productId,
    productName: inventory.product.name,
    quantity: inventory.quantity,
    reserved: inventory.reserved,
    available: inventory.quantity - inventory.reserved,
  };
}

export async function listInventory() {
  const items = await prisma.inventory.findMany({
    include: { product: true },
  });

  return items.map((inv) => ({
    productId: inv.productId,
    productName: inv.product.name,
    sku: inv.product.sku,
    quantity: inv.quantity,
    reserved: inv.reserved,
    available: inv.quantity - inv.reserved,
  }));
}

export async function updateInventory(productId: string, quantity: number) {
  return prisma.inventory.update({
    where: { productId },
    data: { quantity },
  });
}

async function handleOrderCreated(payload: {
  orderId: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  const cached = await getCachedOrder(payload.orderId);

  if (cached) {
    // FIX 3: Usar 'unitPrice' que es como se mapeó al guardar en la caché
    const itemTotal = cached.items.reduce(
      (sum: number, item: any) => sum + item.unitPrice * item.quantity,
      0
    );
    console.log(`Order ${payload.orderId} total from cache: ${itemTotal}`);
  }

  for (const item of payload.items) {
    await prisma.inventory.update({
      where: { productId: item.productId },
      data: {
        quantity: { decrement: item.quantity },
        reserved: { decrement: item.quantity },
      },
    });
  }
}

export function initInventorySubscriber() {
  subscribe("order.created", handleOrderCreated);
}
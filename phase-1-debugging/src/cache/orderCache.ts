import { redisClient } from "../config/redis";

const ORDER_CACHE_TTL = 3600;
const ORDER_CACHE_PREFIX = "order:";

export async function cacheOrder(order: any): Promise<void> {
  const cachePayload = {
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(item.pricePerUnit),
    })),
  };

  await redisClient.set(
    `${ORDER_CACHE_PREFIX}${order.id}`,
    JSON.stringify(cachePayload),
    "EX",
    ORDER_CACHE_TTL
  );
}

export async function getCachedOrder(orderId: string): Promise<any | null> {
  const cached = await redisClient.get(`${ORDER_CACHE_PREFIX}${orderId}`);
  if (!cached) return null;
  return JSON.parse(cached);
}

export async function invalidateOrderCache(orderId: string): Promise<void> {
  await redisClient.del(`${ORDER_CACHE_PREFIX}${orderId}`);
}

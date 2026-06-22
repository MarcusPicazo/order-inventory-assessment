import prisma from "../lib/prisma";
import { publish } from "../lib/eventBus";
import { cacheOrder } from "../cache/orderCache";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export async function createOrder(items: OrderItemInput[]) {
  const order = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      pricePerUnit: number;
    }> = [];

    for (const item of items) {
      const product = await tx.product.findUniqueOrThrow({
        where: { id: item.productId },
      });

      // FIX 2: Incremento atómico en la BD para evitar condición de carrera (overselling)
      const inventory = await tx.inventory.update({
        where: { productId: item.productId },
        data: { reserved: { increment: item.quantity } },
      });

      const available = inventory.quantity - inventory.reserved;
      if (available < 0) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${
            inventory.quantity - (inventory.reserved - item.quantity)
          }, Requested: ${item.quantity}`
        );
      }

      const price = Number(product.pricePerUnit) * item.quantity;
      totalAmount += price;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        pricePerUnit: Number(product.pricePerUnit),
      });
    }

    const created = await tx.order.create({
      data: {
        totalAmount,
        status: "confirmed",
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    // FIX 5: Patrón Outbox para evitar pérdida de eventos si Redis falla
    await tx.outboxEvent.create({
      data: {
        eventType: "order.created",
        payload: {
          orderId: created.id,
          items: orderItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
        published: false,
      },
    });

    return created;
  });

  await cacheOrder(order);

  await publish("order.created", {
    orderId: order.id,
    items: order.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    })),
  });

  return order;
}

export async function getOrder(id: string) {
  return prisma.order.findUniqueOrThrow({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function listOrders(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count(),
  ]);

  return { orders, total, page, limit };
}

export async function getPendingOrders() {
  return prisma.order.findMany({
    where: { status: "pending" },
    include: { items: true },
  });
}
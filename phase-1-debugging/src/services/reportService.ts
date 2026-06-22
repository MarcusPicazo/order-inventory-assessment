import prisma from "../lib/prisma";

export async function getDailySummary(dateStr?: string) {
  // FIX 4: Asignar correctamente el offset de zona horaria (ET es -05:00)
  const targetDate = dateStr || new Date().toISOString().split("T")[0];

  const startOfDay = new Date(`${targetDate}T00:00:00-05:00`);
  const endOfDay = new Date(`${targetDate}T23:59:59.999-05:00`);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: "confirmed",
    },
    include: { items: { include: { product: true } } },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount),
    0
  );

  const productBreakdown: Record<
    string,
    { name: string; unitsSold: number; revenue: number }
  > = {};

  for (const order of orders) {
    for (const item of order.items) {
      const key = item.productId;
      if (!productBreakdown[key]) {
        productBreakdown[key] = {
          name: item.product.name,
          unitsSold: 0,
          revenue: 0,
        };
      }
      productBreakdown[key].unitsSold += item.quantity;
      productBreakdown[key].revenue +=
        Number(item.pricePerUnit) * item.quantity;
    }
  }

  return {
    date: targetDate,
    orderCount: orders.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    products: Object.values(productBreakdown),
  };
}
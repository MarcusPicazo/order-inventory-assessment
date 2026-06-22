import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.outboxEvent.deleteMany();

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Wireless Keyboard",
        sku: "KB-001",
        pricePerUnit: 49.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "USB-C Hub",
        sku: "HUB-002",
        pricePerUnit: 34.5,
      },
    }),
    prisma.product.create({
      data: {
        name: "Monitor Stand",
        sku: "MS-003",
        pricePerUnit: 79.95,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mechanical Keyboard",
        sku: "KB-004",
        pricePerUnit: 129.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Webcam HD",
        sku: "WC-005",
        pricePerUnit: 59.0,
      },
    }),
  ]);

  await Promise.all(
    products.map((p, i) =>
      prisma.inventory.create({
        data: {
          productId: p.id,
          quantity: (i + 1) * 10,
        },
      })
    )
  );

  const order1 = await prisma.order.create({
    data: {
      status: "confirmed",
      totalAmount: 99.98,
      createdAt: new Date("2026-03-11T23:15:00-05:00"),
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            pricePerUnit: 49.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      status: "confirmed",
      totalAmount: 34.5,
      createdAt: new Date("2026-03-11T23:45:00-05:00"),
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            pricePerUnit: 34.5,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      status: "confirmed",
      totalAmount: 159.9,
      createdAt: new Date("2026-03-12T00:10:00-05:00"),
      items: {
        create: [
          {
            productId: products[2].id,
            quantity: 2,
            pricePerUnit: 79.95,
          },
        ],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      status: "confirmed",
      totalAmount: 189.99,
      createdAt: new Date("2026-03-10T22:30:00-05:00"),
      items: {
        create: [
          {
            productId: products[3].id,
            quantity: 1,
            pricePerUnit: 129.99,
          },
          {
            productId: products[4].id,
            quantity: 1,
            pricePerUnit: 59.0,
          },
        ],
      },
    },
  });

  const order5 = await prisma.order.create({
    data: {
      status: "pending",
      totalAmount: 259.98,
      createdAt: new Date("2026-03-12T01:00:00-05:00"),
      items: {
        create: [
          {
            productId: products[3].id,
            quantity: 2,
            pricePerUnit: 129.99,
          },
        ],
      },
    },
  });

  await prisma.apiKey.create({
    data: {
      name: "test-client",
      keyHash: hashKey("sk_test_a1b2c3d4e5f6"),
      active: true,
    },
  });

  await prisma.apiKey.create({
    data: {
      name: "admin-client",
      keyHash: hashKey("sk_admin_x9y8z7w6v5u4"),
      active: true,
    },
  });

  await prisma.apiKey.create({
    data: {
      name: "disabled-client",
      keyHash: hashKey("sk_disabled_000000"),
      active: false,
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

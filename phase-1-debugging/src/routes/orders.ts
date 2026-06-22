import { Router, Request, Response } from "express";
import { createOrder, getOrder, listOrders } from "../services/orderService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Items array is required" });
      return;
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        res.status(400).json({ error: "Each item must have a valid productId and quantity" });
        return;
      }
    }

    const order = await createOrder(items);
    res.status(201).json(order);
  } catch (err: any) {
    if (err.message?.includes("Insufficient stock")) {
      res.status(409).json({ error: err.message });
      return;
    }
    throw err;
  }
});

router.get("/", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await listOrders(page, limit);
  res.json(result);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await getOrder(req.params.id);
    res.json(order);
  } catch {
    res.status(404).json({ error: "Order not found" });
  }
});

export default router;

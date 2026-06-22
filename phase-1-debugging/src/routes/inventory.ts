import { Router, Request, Response } from "express";
import {
  getInventory,
  listInventory,
  updateInventory,
} from "../services/inventoryService";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const inventory = await listInventory();
  res.json(inventory);
});

router.get("/:productId", async (req: Request, res: Response) => {
  try {
    const inventory = await getInventory(req.params.productId);
    res.json(inventory);
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
});

router.patch("/:productId", async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 0) {
      res.status(400).json({ error: "Valid quantity is required" });
      return;
    }

    const updated = await updateInventory(req.params.productId, quantity);
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
});

export default router;

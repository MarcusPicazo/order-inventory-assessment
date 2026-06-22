import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import orderRoutes from "./orders";
import inventoryRoutes from "./inventory";
import reportRoutes from "./reports";

const router = Router();

router.use("/orders", authMiddleware, orderRoutes);
router.use("/inventory", authMiddleware, inventoryRoutes);
router.use("/reports", authMiddleware, reportRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;

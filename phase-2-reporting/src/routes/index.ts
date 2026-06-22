import { Router } from "express";
import reportRoutes from "./reports";

const router = Router();

router.use("/reports", reportRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;

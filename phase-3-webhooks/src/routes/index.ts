import { Router } from "express";
import webhookRoutes from "./webhooks";

const router = Router();

router.use("/webhooks", webhookRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;

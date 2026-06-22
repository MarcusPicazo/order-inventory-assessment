import { Router, Request, Response } from "express";
import { getDailySummary } from "../services/reportService";

const router = Router();

router.get("/daily-summary", async (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  const summary = await getDailySummary(date);
  res.json(summary);
});

export default router;

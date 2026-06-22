import { Router, Request, Response } from "express";
import { getSalesReport } from "../services/salesReportService";
import { getInventoryReport } from "../services/inventoryReportService";
import { getTopProducts } from "../services/topProductsService";

const router = Router();

router.get("/sales", async (req: Request, res: Response) => {
  try {
    const query = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      groupBy: req.query.groupBy as "day" | "week" | "month",
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };
    const report = await getSalesReport(query);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/inventory", async (_req: Request, res: Response) => {
  try {
    const report = await getInventoryReport();
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/top-products", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const report = await getTopProducts(limit);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

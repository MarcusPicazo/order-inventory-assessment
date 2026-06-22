import { Router, Request, Response } from "express";
import {
  registerWebhook,
  listWebhooks,
  deleteWebhook,
} from "../services/webhookRegistrationService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { url, events } = req.body;

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      res.status(400).json({ error: "url and events array are required" });
      return;
    }

    const endpoint = await registerWebhook({ url, events });
    res.status(201).json(endpoint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const endpoints = await listWebhooks();
    res.json(endpoints);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteWebhook(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

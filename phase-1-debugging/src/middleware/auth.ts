import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({ error: "Missing API key" });
    return;
  }

  // FIX 1: Hashear usando 'hex' en lugar de 'base64'
  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

  const record = await prisma.apiKey.findUnique({
    where: { keyHash },
  });

  if (!record || !record.active) {
    res.status(403).json({ error: "Invalid or inactive API key" });
    return;
  }

  next();
}
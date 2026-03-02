import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const state = mongoose.connection.readyState;

  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    status: state === 1 ? "ok" : "error",
    database: states[state],
  });
});

export default router;

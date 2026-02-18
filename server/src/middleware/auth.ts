import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types/index.js";

// ── Verify JWT token ──────────────────────────────────────────
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ── Admin-only guard ──────────────────────────────────────────
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
};

// ── Seller or Admin guard ─────────────────────────────────────
export const requireSeller = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !["seller", "admin"].includes(req.user.role)) {
    res.status(403).json({ success: false, message: "Seller access required" });
    return;
  }
  next();
};

// ── Optional auth (public routes that may benefit from user context) ──
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      // Token invalid but route is public — ignore silently
    }
  }
  next();
};

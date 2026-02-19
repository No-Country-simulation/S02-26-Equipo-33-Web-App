import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { validationResult } from "express-validator";
import { authRoutes, horseRoutes, adminRoutes, chatRoutes, databaseRoutes} from "./routes/index";


const app: Application = express();

// ── Security headers ──────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ── Global rate limiter ───────────────────────────────────────
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,  // 15 min
  max:      Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use(limiter);

// ── Strict limiter for auth endpoints ─────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
});

// ── Validation error handler middleware ───────────────────────
// Run this after validation rules in routes
app.use((req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }
  next();
});

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Horse Portal API is running", env: process.env.NODE_ENV });
});

app.use("/health/db",   databaseRoutes); //  Database
// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",   authLimiter, authRoutes);
app.use("/api/horses", horseRoutes);
app.use("/api/admin",  adminRoutes);
app.use("/api/chat",   chatRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});


export default app;

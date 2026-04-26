import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

// General API rate limiter: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: {
      en: "Too many requests, please try again later.",
      am: "በጣም ብዙ ጥያቄዎች። እባክዎ ቆየት ብለው ይሞክሩ።",
    },
  },
});

// Stricter rate limiter for send operations: 10 per 15 minutes
export const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: {
      en: "Too many emails sent. Please wait before sending more.",
      am: "በጣም ብዙ ኢሜይሎች ተልከዋል። ተጨማሪ ከመላክዎ በፊት ይጠብቁ።",
    },
  },
});

// Simple in-memory idempotency store (TTL: 5 minutes)
const idempotencyStore = new Map<string, { response: unknown; timestamp: number }>();
const IDEMPOTENCY_TTL = 5 * 60 * 1000;

// Cleanup old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of idempotencyStore.entries()) {
    if (now - value.timestamp > IDEMPOTENCY_TTL) {
      idempotencyStore.delete(key);
    }
  }
}, 60 * 1000);

export const idempotencyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const idempotencyKey = req.headers["x-idempotency-key"];

  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    // No idempotency key provided, proceed normally
    next();
    return;
  }

  const cached = idempotencyStore.get(idempotencyKey);
  if (cached && Date.now() - cached.timestamp < IDEMPOTENCY_TTL) {
    // Return cached response
    res.status(200).json(cached.response);
    return;
  }

  // Intercept the response to cache it
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(idempotencyKey, {
        response: body,
        timestamp: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
};

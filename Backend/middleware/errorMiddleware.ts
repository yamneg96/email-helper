import { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).json({
    message: {
      en: `Route not found: ${req.originalUrl}`,
      am: `መንገድ አልተገኘም: ${req.originalUrl}`,
    },
  });
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  const fallbackMessage = "Unexpected server error.";

  res.status(statusCode).json({
    message: {
      en: err.message || fallbackMessage,
      am: `ስህተት ተፈጥሯል: ${err.message || "ያልታወቀ ችግር"}`,
    },
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

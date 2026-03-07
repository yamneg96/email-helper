import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserDocument } from "../models/User";

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

    const token = bearerToken || req.cookies?.token;

    if (!token) {
      res.status(401).json({
        message: {
          en: "Unauthorized: token is missing.",
          am: "ያልተፈቀደ: ቶከን አልተገኘም።",
        },
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        message: {
          en: "Unauthorized: user no longer exists.",
          am: "ያልተፈቀደ: ተጠቃሚው አልተገኘም።",
        },
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleIdToken } from "../config/gmail";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { GmailTokens, User } from "../models/User";
import { Template } from "../models/Template";

interface LoginBody {
  idToken?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  accessToken?: string;
}

const generateJwt = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  type JwtExpires = Exclude<jwt.SignOptions["expiresIn"], undefined>;
  const envExpires = process.env.JWT_EXPIRES_IN as JwtExpires | undefined;
  const signOptions: jwt.SignOptions = envExpires
    ? { expiresIn: envExpires }
    : { expiresIn: "7d" };

  return jwt.sign({ userId }, secret as jwt.Secret, signOptions);
};

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { idToken, email, password, refreshToken, accessToken } = req.body;

    let userEmail = email;
    let userName = "New User";

    if (idToken) {
      const payload = await verifyGoogleIdToken(idToken);
      userEmail = payload.email;
      userName = payload.name;
    }

    if (!userEmail) {
      res.status(400).json({
        message: {
          en: "Email or Google ID token is required.",
          am: "ኢሜይል ወይም Google ID token ያስፈልጋል።",
        },
      });
      return;
    }

    let user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      if (!idToken && !password) {
        res.status(400).json({
          message: {
            en: "Password is required for first login without Google token.",
            am: "Google token ካልተጠቀሙ በመጀመሪያ መግቢያ የይለፍ ቃል ያስፈልጋል።",
          },
        });
        return;
      }

      user = await User.create({
        name: userName,
        email: userEmail.toLowerCase(),
        password:
          password || `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        ...(accessToken || refreshToken
          ? {
              gmailTokens: {
                ...(accessToken ? { accessToken } : {}),
                ...(refreshToken ? { refreshToken } : {}),
              },
            }
          : {}),
      });

      // Seed default worker report templates for new users
      await Template.insertMany([
        {
          userId: user._id,
          name: "Daily Work Report",
          subject: "Daily Progress Report - {{date}}",
          body: "Hello Manager,\n\nHere is my daily report for today:\n\nTasks Completed:\n1. \n2. \n\nPending Tasks:\n- \n\nIssues/Blockers:\n- None\n\nBest regards,\n" + userName,
          language: "en",
        },
        {
          userId: user._id,
          name: "የዕለት የስራ ሪፖርት",
          subject: "የዕለት የስራ ሪፖርት - {{date}}",
          body: "ሰላም ኃላፊ፣\n\nየዛሬው የስራ ሪፖርቴ ይህን ይመስላል:\n\nየተሰሩ ስራዎች:\n1. \n2. \n\nቀሪ ስራዎች:\n- \n\nያጋጠሙ ችግሮች:\n- የሉም\n\nከሠላምታ ጋር፣\n" + userName,
          language: "am",
        },
        {
          userId: user._id,
          name: "Weekly Status Update",
          subject: "Weekly Status Update: [Project Name]",
          body: "Hi Team,\n\nHere is the summary of what was achieved this week:\n\nKey Achievements:\n- \n- \n\nNext Week's Plan:\n- \n- \n\nThanks,\n" + userName,
          language: "en",
        }
      ]);
    } else if (!idToken) {
      if (!password) {
        res.status(400).json({
          message: {
            en: "Password is required.",
            am: "የይለፍ ቃል ያስፈልጋል።",
          },
        });
        return;
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        res.status(401).json({
          message: {
            en: "Invalid credentials.",
            am: "የተሳሳተ መለያ መረጃ።",
          },
        });
        return;
      }
    }

    if (idToken && (refreshToken || accessToken)) {
      const nextTokens: GmailTokens = {
        ...(user.gmailTokens?.refreshToken
          ? { refreshToken: user.gmailTokens.refreshToken }
          : {}),
        ...(user.gmailTokens?.accessToken
          ? { accessToken: user.gmailTokens.accessToken }
          : {}),
      };

      if (refreshToken) {
        nextTokens.refreshToken = refreshToken;
      }

      if (accessToken) {
        nextTokens.accessToken = accessToken;
      }

      user.gmailTokens = nextTokens;
      await user.save();
    }

    const token = generateJwt(user._id.toString());
    setTokenCookie(res, token);

    res.status(200).json({
      message: {
        en: "Login successful.",
        am: "በተሳካ ሁኔታ ገብተዋል።",
      },
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        language: user.language,
        theme: user.theme,
        onboarding: user.onboarding,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: {
        en: "Logged out successfully.",
        am: "በተሳካ ሁኔታ ወጥተዋል።",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: {
          en: "Unauthorized.",
          am: "ያልተፈቀደ ጥያቄ።",
        },
      });
      return;
    }

    res.status(200).json({
      message: {
        en: "Current user fetched successfully.",
        am: "የአሁኑ ተጠቃሚ መረጃ በተሳካ ሁኔታ ተመልሷል።",
      },
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        language: req.user.language,
        theme: req.user.theme,
        onboarding: req.user.onboarding,
      },
    });
  } catch (error) {
    next(error);
  }
};

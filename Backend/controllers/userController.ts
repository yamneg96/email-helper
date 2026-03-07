import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";

interface ProfileBody {
  name?: string;
  email?: string;
  password?: string;
}

interface SettingsBody {
  language?: "en" | "am";
  theme?: "light" | "dark" | "system";
  onboardingStep?: number;
  onboardingCompleted?: boolean;
}

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: { en: "Unauthorized.", am: "ያልተፈቀደ ጥያቄ።" },
      });
      return;
    }

    const { name, email, password } = req.body as ProfileBody;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({
        message: {
          en: "User not found.",
          am: "ተጠቃሚው አልተገኘም።",
        },
      });
      return;
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email.toLowerCase();
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      message: {
        en: "Profile updated successfully.",
        am: "ፕሮፋይል በተሳካ ሁኔታ ዘምኗል።",
      },
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: { en: "Unauthorized.", am: "ያልተፈቀደ ጥያቄ።" },
      });
      return;
    }

    const { language, theme, onboardingStep, onboardingCompleted } =
      req.body as SettingsBody;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        message: {
          en: "User not found.",
          am: "ተጠቃሚው አልተገኘም።",
        },
      });
      return;
    }

    if (language) {
      user.language = language;
    }

    if (theme) {
      user.theme = theme;
    }

    if (typeof onboardingStep === "number") {
      user.onboarding.step = onboardingStep;
    }

    if (typeof onboardingCompleted === "boolean") {
      user.onboarding.completed = onboardingCompleted;
    }

    await user.save();

    res.status(200).json({
      message: {
        en: "Settings updated successfully.",
        am: "ቅንብሮች በተሳካ ሁኔታ ዘምነዋል።",
      },
      settings: {
        language: user.language,
        theme: user.theme,
        onboarding: user.onboarding,
      },
    });
  } catch (error) {
    next(error);
  }
};

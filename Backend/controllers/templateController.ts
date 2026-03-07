import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Template } from "../models/Template";

interface TemplateBody {
  name: string;
  subject: string;
  body: string;
  language?: "en" | "am";
}

export const createTemplate = async (
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

    const { name, subject, body, language } = req.body as TemplateBody;
    if (!name || !subject || !body) {
      res.status(400).json({
        message: {
          en: "name, subject and body are required.",
          am: "name, subject እና body ያስፈልጋሉ።",
        },
      });
      return;
    }

    const template = await Template.create({
      userId: req.user._id,
      name,
      subject,
      body,
      language: language || req.user.language,
    });

    res.status(201).json({
      message: {
        en: "Template created successfully.",
        am: "ቴምፕሌት በተሳካ ሁኔታ ተፈጥሯል።",
      },
      template,
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplates = async (
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

    const templates = await Template.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: {
        en: "Templates fetched successfully.",
        am: "ቴምፕሌቶች በተሳካ ሁኔታ ተመልሰዋል።",
      },
      items: templates,
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (
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

    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      res.status(404).json({
        message: { en: "Template not found.", am: "ቴምፕሌት አልተገኘም።" },
      });
      return;
    }

    res.status(200).json({
      message: {
        en: "Template fetched successfully.",
        am: "ቴምፕሌቱ በተሳካ ሁኔታ ተመልሷል።",
      },
      template,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (
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

    const { name, subject, body, language } = req.body as Partial<TemplateBody>;

    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, subject, body, language },
      { new: true, runValidators: true },
    );

    if (!template) {
      res.status(404).json({
        message: { en: "Template not found.", am: "ቴምፕሌት አልተገኘም።" },
      });
      return;
    }

    res.status(200).json({
      message: {
        en: "Template updated successfully.",
        am: "ቴምፕሌቱ በተሳካ ሁኔታ ዘምኗል።",
      },
      template,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (
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

    const template = await Template.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      res.status(404).json({
        message: { en: "Template not found.", am: "ቴምፕሌት አልተገኘም።" },
      });
      return;
    }

    res.status(200).json({
      message: {
        en: "Template deleted successfully.",
        am: "ቴምፕሌቱ በተሳካ ሁኔታ ተሰርዟል።",
      },
    });
  } catch (error) {
    next(error);
  }
};

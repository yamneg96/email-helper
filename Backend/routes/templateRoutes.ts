import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplates,
  updateTemplate,
} from "../controllers/templateController";
import { protect } from "../middleware/authMiddleware";

const templateRouter = Router();

templateRouter.use(protect);
templateRouter.get("/", getTemplates);
templateRouter.post("/", createTemplate);
templateRouter.get("/:id", getTemplateById);
templateRouter.put("/:id", updateTemplate);
templateRouter.delete("/:id", deleteTemplate);

export default templateRouter;

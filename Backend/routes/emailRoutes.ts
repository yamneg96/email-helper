import { Router } from "express";
import {
  fetchInbox,
  fetchSent,
  replyEmail,
  sendEmail,
  sendTestEmail,
} from "../controllers/emailController";
import { protect } from "../middleware/authMiddleware";

const emailRouter = Router();

emailRouter.use(protect);
emailRouter.post("/send", sendEmail);
emailRouter.post("/reply", replyEmail);
emailRouter.get("/inbox", fetchInbox);
emailRouter.get("/sent", fetchSent);
emailRouter.post("/send-test", sendTestEmail);

export default emailRouter;

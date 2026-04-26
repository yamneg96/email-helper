import { Router } from "express";
import {
  fetchInbox,
  fetchSent,
  replyEmail,
  sendEmail,
  sendTestEmail,
  downloadInboxAttachment,
  downloadSentAttachment,
} from "../controllers/emailController";
import { protect } from "../middleware/authMiddleware";
import { sendLimiter, idempotencyMiddleware } from "../middleware/rateLimiter";

const emailRouter = Router();

emailRouter.use(protect);
emailRouter.post("/send", sendLimiter, idempotencyMiddleware, sendEmail);
emailRouter.post("/reply", sendLimiter, idempotencyMiddleware, replyEmail);
emailRouter.get("/inbox", fetchInbox);
emailRouter.get("/sent", fetchSent);
emailRouter.post("/send-test", sendLimiter, sendTestEmail);

emailRouter.get("/attachment/:messageId/:attachmentId", downloadInboxAttachment);
emailRouter.get("/local-attachment/:emailId/:filename", downloadSentAttachment);

export default emailRouter;

import { NextFunction, Response } from "express";
import {
  buildRawMimeMessage,
  getGmailService,
  sendWithNodemailerFallback,
} from "../config/gmail";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Email } from "../models/Email";
import { Template } from "../models/Template";

interface AttachmentInput {
  filename: string;
  mimeType: string;
  contentBase64: string;
}

interface SendEmailBody {
  to: string;
  subject?: string;
  body?: string;
  templateId?: string;
  language?: "en" | "am";
  attachments?: AttachmentInput[];
}

interface ReplyEmailBody {
  to: string;
  body: string;
  subject?: string;
  threadId: string;
  inReplyTo?: string;
  references?: string;
  attachments?: AttachmentInput[];
}

const parseHeader = (
  headers: { name?: string | null; value?: string | null }[] | undefined,
  key: string,
): string => {
  if (!headers) {
    return "";
  }

  return (
    headers.find((item) => item.name?.toLowerCase() === key.toLowerCase())
      ?.value || ""
  );
};

export const sendEmail = async (
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

    const { to, subject, body, templateId, language, attachments } =
      req.body as SendEmailBody;

    console.log(`[sendEmail] Request received from user ${req.user._id}`);
    console.log(`[sendEmail] To: ${to}, Subject: ${subject}, Attachments count: ${attachments?.length || 0}`);

    if (!to) {
      res.status(400).json({
        message: {
          en: "Recipient email is required.",
          am: "የተቀባይ ኢሜይል ያስፈልጋል።",
        },
      });
      return;
    }

    let finalSubject = subject ?? "";
    let finalBody = body ?? "";
    const selectedLanguage = language || req.user.language;

    if (templateId) {
      const template = await Template.findOne({
        _id: templateId,
        userId: req.user._id,
      });
      if (!template) {
        res.status(404).json({
          message: {
            en: "Template not found.",
            am: "ቴምፕሌት አልተገኘም።",
          },
        });
        return;
      }

      finalSubject = finalSubject || template.subject;
      finalBody = finalBody || template.body;
    }

    if (!finalSubject || !finalBody) {
      res.status(400).json({
        message: {
          en: "Subject and body are required (directly or via template).",
          am: "ርዕስ እና ይዘት ያስፈልጋሉ (በቀጥታ ወይም በቴምፕሌት)።",
        },
      });
      return;
    }

    const fromEmail = process.env.DEFAULT_FROM_EMAIL || req.user.email;

    // Build RFC822 MIME payload for Gmail API, including optional attachments.
    const raw = buildRawMimeMessage({
      from: fromEmail,
      to,
      subject: finalSubject,
      textBody: finalBody,
      ...(attachments ? { attachments } : {}),
    });

    let sentMessageId = "";
    let threadId = "";

    try {
      console.log("[sendEmail] Attempting to send via Gmail API...");
      const gmail = getGmailService(req.user.gmailTokens);
      const result = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
      });

      sentMessageId = result.data.id || "";
      threadId = result.data.threadId || "";
      console.log(`[sendEmail] Successfully sent via Gmail API, messageId: ${sentMessageId}`);
    } catch (gmailError) {
      console.error("[sendEmail] Gmail API failed:", gmailError);
      // If Gmail API fails (token/config), fallback to nodemailer with Gmail OAuth2.
      try {
        console.log("[sendEmail] Attempting fallback to Nodemailer...");
        await sendWithNodemailerFallback({
          from: fromEmail,
          to,
          subject: finalSubject,
          text: finalBody,
          ...(attachments ? { attachments } : {}),
        });
        
        sentMessageId = "fallback-nodemailer";
        console.log("[sendEmail] Successfully sent via Nodemailer fallback");
      } catch (fallbackError) {
        console.error("[sendEmail] Nodemailer fallback also failed:", fallbackError);
        throw fallbackError;
      }
    }

    const created = await Email.create({
      userId: req.user._id,
      sender: fromEmail,
      recipient: to,
      subject: finalSubject,
      body: finalBody,
      attachments: (attachments || []).map((item) => ({
        filename: item.filename,
        mimeType: item.mimeType,
        size: Buffer.from(item.contentBase64, "base64").length,
      })),
      status: "sent",
      messageId: sentMessageId,
      threadId,
      language: selectedLanguage,
    });

    res.status(201).json({
      message: {
        en: "Email sent successfully.",
        am: "ኢሜይሉ በተሳካ ሁኔታ ተልኳል።",
      },
      email: created,
    });
  } catch (error) {
    console.error("[sendEmail] Unhandled error:", error);
    next(error);
  }
};

export const replyEmail = async (
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

    const { to, body, subject, threadId, inReplyTo, references, attachments } =
      req.body as ReplyEmailBody;

    if (!to || !body || !threadId) {
      res.status(400).json({
        message: {
          en: "to, body, and threadId are required.",
          am: "to, body እና threadId ያስፈልጋሉ።",
        },
      });
      return;
    }

    const fromEmail = process.env.DEFAULT_FROM_EMAIL || req.user.email;
    const finalSubject = subject || "Re: Reply";

    const raw = buildRawMimeMessage({
      from: fromEmail,
      to,
      subject: finalSubject,
      textBody: body,
      ...(inReplyTo ? { inReplyTo } : {}),
      ...(references ? { references } : {}),
      ...(attachments ? { attachments } : {}),
    });

    const gmail = getGmailService(req.user.gmailTokens);
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
        threadId,
      },
    });

    const created = await Email.create({
      userId: req.user._id,
      sender: fromEmail,
      recipient: to,
      subject: finalSubject,
      body,
      attachments: (attachments || []).map((item) => ({
        filename: item.filename,
        mimeType: item.mimeType,
        size: Buffer.from(item.contentBase64, "base64").length,
      })),
      status: "sent",
      messageId: result.data.id || "",
      threadId: result.data.threadId || threadId,
      language: req.user.language,
    });

    res.status(201).json({
      message: {
        en: "Reply sent successfully.",
        am: "መልስ በተሳካ ሁኔታ ተልኳል።",
      },
      email: created,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchInbox = async (
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

    const gmail = getGmailService(req.user.gmailTokens);
    const listResult = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
      labelIds: ["INBOX"],
    });

    const messageIds = listResult.data.messages || [];
    const messages = await Promise.all(
      messageIds.map((item) =>
        gmail.users.messages.get({
          userId: "me",
          id: item.id || "",
          format: "metadata",
          metadataHeaders: ["From", "To", "Subject"],
        }),
      ),
    );

    const normalized = messages.map((msg) => {
      const headers = msg.data.payload?.headers;
      return {
        messageId: msg.data.id || "",
        threadId: msg.data.threadId || "",
        sender: parseHeader(headers, "From"),
        recipient: parseHeader(headers, "To"),
        subject: parseHeader(headers, "Subject"),
        snippet: msg.data.snippet || "",
      };
    });

    await Promise.all(
      normalized.map((item) =>
        Email.findOneAndUpdate(
          { userId: req.user?._id, messageId: item.messageId } as Record<
            string,
            unknown
          >,
          {
            userId: req.user?._id,
            sender: item.sender,
            recipient: item.recipient,
            subject: item.subject || "(No subject)",
            body: item.snippet,
            status: "received",
            messageId: item.messageId,
            threadId: item.threadId,
            language: req.user?.language || "en",
          } as Record<string, unknown>,
          { upsert: true, new: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    res.status(200).json({
      message: {
        en: "Inbox fetched successfully.",
        am: "Inbox በተሳካ ሁኔታ ተመልሷል።",
      },
      items: normalized,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchSent = async (
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

    const sentItems = await Email.find({ userId: req.user._id, status: "sent" })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      message: {
        en: "Sent emails fetched successfully.",
        am: "የተላኩ ኢሜይሎች በተሳካ ሁኔታ ተመልሰዋል።",
      },
      items: sentItems,
    });
  } catch (error) {
    next(error);
  }
};

export const sendTestEmail = async (
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

    const targetEmail = req.user.email;
    const gmail = getGmailService(req.user.gmailTokens);
    const fromEmail = process.env.DEFAULT_FROM_EMAIL || req.user.email;

    const raw = buildRawMimeMessage({
      from: fromEmail,
      to: targetEmail,
      subject: "Test Email | የሙከራ ኢሜይል",
      textBody: "This is a Gmail API test email. | ይህ የGmail API የሙከራ ኢሜይል ነው።",
    });

    const sent = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });

    res.status(200).json({
      message: {
        en: "Test email sent successfully.",
        am: "የሙከራ ኢሜይል በተሳካ ሁኔታ ተልኳል።",
      },
      gmailMessageId: sent.data.id,
    });
  } catch (error) {
    next(error);
  }
};

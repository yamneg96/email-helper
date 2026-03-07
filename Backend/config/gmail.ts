import { google, gmail_v1 } from "googleapis";
import nodemailer from "nodemailer";

export interface GmailTokenBundle {
  accessToken?: string;
  refreshToken?: string;
}

const getBaseOAuthClient = (): InstanceType<typeof google.auth.OAuth2> => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Gmail OAuth environment variables are missing. Check GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REDIRECT_URI.",
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

export const getOAuthClientForUser = (
  userTokens?: GmailTokenBundle,
): InstanceType<typeof google.auth.OAuth2> => {
  const oauth2Client = getBaseOAuthClient();

  const refreshToken =
    userTokens?.refreshToken || process.env.GMAIL_REFRESH_TOKEN;
  const accessToken = userTokens?.accessToken;

  if (!refreshToken) {
    throw new Error(
      "No Gmail refresh token provided. Add GMAIL_REFRESH_TOKEN or save per-user Gmail token.",
    );
  }

  const credentials: {
    refresh_token: string;
    access_token?: string | null;
  } = {
    refresh_token: refreshToken,
  };

  if (accessToken) {
    credentials.access_token = accessToken;
  }

  oauth2Client.setCredentials(credentials);

  return oauth2Client;
};

export const getGmailService = (
  userTokens?: GmailTokenBundle,
): gmail_v1.Gmail => {
  const auth = getOAuthClientForUser(userTokens);
  return google.gmail({ version: "v1", auth });
};

const encodeBase64Url = (value: string): string =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

interface AttachmentPayload {
  filename: string;
  mimeType: string;
  contentBase64: string;
}

export interface BuildMimeArgs {
  from: string;
  to: string;
  subject: string;
  textBody: string;
  inReplyTo?: string;
  references?: string;
  attachments?: AttachmentPayload[];
}

export const buildRawMimeMessage = (args: BuildMimeArgs): string => {
  const boundary = `boundary_${Date.now()}`;
  const lines: string[] = [
    `From: ${args.from}`,
    `To: ${args.to}`,
    `Subject: ${args.subject}`,
    "MIME-Version: 1.0",
  ];

  if (args.inReplyTo) {
    lines.push(`In-Reply-To: ${args.inReplyTo}`);
  }

  if (args.references) {
    lines.push(`References: ${args.references}`);
  }

  if (args.attachments && args.attachments.length > 0) {
    lines.push(`Content-Type: multipart/mixed; boundary=\"${boundary}\"`);
    lines.push("");
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push("Content-Transfer-Encoding: 7bit");
    lines.push("");
    lines.push(args.textBody);
    lines.push("");

    for (const attachment of args.attachments) {
      lines.push(`--${boundary}`);
      lines.push(
        `Content-Type: ${attachment.mimeType}; name=\"${attachment.filename}\"`,
      );
      lines.push("Content-Transfer-Encoding: base64");
      lines.push(
        `Content-Disposition: attachment; filename=\"${attachment.filename}\"`,
      );
      lines.push("");
      lines.push(attachment.contentBase64);
      lines.push("");
    }

    lines.push(`--${boundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push("Content-Transfer-Encoding: 7bit");
    lines.push("");
    lines.push(args.textBody);
  }

  return encodeBase64Url(lines.join("\r\n"));
};

export const sendWithNodemailerFallback = async (args: {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments?: AttachmentPayload[];
}): Promise<void> => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const user = args.from.includes("<")
    ? args.from.split("<")[1]?.replace(">", "").trim()
    : args.from;

  if (!clientId || !clientSecret || !refreshToken || !user) {
    throw new Error(
      "Nodemailer fallback is not configured properly for Gmail OAuth2.",
    );
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
  });

  await transport.sendMail({
    from: args.from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    attachments: args.attachments?.map((file) => ({
      filename: file.filename,
      content: Buffer.from(file.contentBase64, "base64"),
      contentType: file.mimeType,
    })),
  });
};

export const verifyGoogleIdToken = async (
  idToken: string,
): Promise<{ email: string; name: string }> => {
  const oauthClient = getBaseOAuthClient();
  const clientId = process.env.GMAIL_CLIENT_ID;

  if (!clientId) {
    throw new Error("GMAIL_CLIENT_ID is missing.");
  }

  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Google token is missing an email claim.");
  }

  return {
    email: payload.email,
    name: payload.name || payload.email.split("@")[0] || "Google User",
  };
};

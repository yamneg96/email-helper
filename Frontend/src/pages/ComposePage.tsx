import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { AppLanguage } from "@/lib/api/types";
import React, { useState } from "react";

interface LocalAttachment {
  filename: string;
  mimeType: string;
  contentBase64: string;
}

export default function ComposePage() {
  const { token, user } = useAuth();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const readFiles = async (files: FileList): Promise<LocalAttachment[]> => {
    const reads = Array.from(files).map(
      (file) =>
        new Promise<LocalAttachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string") {
              reject(new Error("File parsing failed."));
              return;
            }

            const base64 = result.split(",")[1];
            if (!base64) {
              reject(new Error("Invalid attachment data."));
              return;
            }

            resolve({
              filename: file.name,
              mimeType: file.type || "application/octet-stream",
              contentBase64: base64,
            });
          };
          reader.onerror = () =>
            reject(new Error(`Failed to read ${file.name}.`));
          reader.readAsDataURL(file);
        }),
    );

    return Promise.all(reads);
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const parsed = await readFiles(event.target.files);
    setAttachments(parsed);
  };

  const onSend = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !user) {
      return;
    }

    setSending(true);
    setMessage("");

    try {
      console.log("[ComposePage] Sending email payload...");
      const response = await apiClient.sendEmail(token, {
        to,
        subject,
        body,
        language: (user.language || "en") as AppLanguage,
        attachments,
      });

      console.log("[ComposePage] Email sent successfully:", response);
      setMessage(response.message?.en || "Email sent successfully.");
      setTo("");
      setSubject("");
      setBody("");
      setAttachments([]);
    } catch (error) {
      console.error("[ComposePage] onSend error:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to send email.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-black">Compose Email (ኢሜይል መጻፊያ)</h1>
        <p className="text-sm text-muted-foreground">
          Fill in details and send via Gmail API.
        </p>
      </header>

      <form
        className="space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={onSend}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold">To (ለማን)</label>
          <Input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Subject (ርዕስ)
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Message (መልእክት)
          </label>
          <textarea
            className="min-h-[220px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 focus-visible:ring-[3px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input type="file" multiple onChange={onFileChange} />
          <Button disabled={sending} type="submit">
            {sending ? "Sending..." : "Send (ላክ)"}
          </Button>
        </div>

        {attachments.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {attachments.length} attachment(s) selected.
          </p>
        ) : null}

        {message ? (
          <p className="text-sm font-semibold text-primary">{message}</p>
        ) : null}
      </form>
    </div>
  );
}

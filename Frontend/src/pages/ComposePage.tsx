import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import type { AppLanguage } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { Paperclip, Send, Info } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface LocalAttachment {
  filename: string;
  mimeType: string;
  contentBase64: string;
}

const RECENT_RECIPIENTS_KEY = "recentRecipients";

function getRecentRecipients(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_RECIPIENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecipient(email: string) {
  const existing = getRecentRecipients();
  const filtered = existing.filter((e) => e !== email);
  filtered.unshift(email);
  localStorage.setItem(
    RECENT_RECIPIENTS_KEY,
    JSON.stringify(filtered.slice(0, 20)),
  );
}

export default function ComposePage() {
  const { token, user } = useAuth();
  const location = useLocation();
  const templateState = location.state as { subject?: string; body?: string } | null;
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(templateState?.subject || "");
  const [body, setBody] = useState(templateState?.body || "");
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (to.length > 0) {
      const recent = getRecentRecipients();
      const filtered = recent.filter((e) =>
        e.toLowerCase().includes(to.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [to]);

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
    if (!event.target.files?.length) return;
    const parsed = await readFiles(event.target.files);
    setAttachments((prev) => [...prev, ...parsed]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !user) return;

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
      saveRecipient(to);
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
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Compose Email{" "}
          <span className="ml-2 font-normal text-muted-foreground">
            (ኢሜይል መጻፊያ)
          </span>
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to send your message.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <form className="flex flex-col gap-8 p-6 md:p-10" onSubmit={onSend}>
          {/* To Field with Autocomplete */}
          <div className="relative space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              To (ለማን)
            </label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="example@email.com"
              required
              className="h-12"
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                {suggestions.map((email) => (
                  <button
                    key={email}
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                    onMouseDown={() => {
                      setTo(email);
                      setShowSuggestions(false);
                    }}
                  >
                    {email}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              Subject (ርዕስ)
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this email about?"
              required
              className="h-12"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              Message (መልእክት)
            </label>
            <textarea
              className="min-h-[250px] w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring/50 transition-all focus-visible:ring-[3px] placeholder:text-muted-foreground"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              required
            />
          </div>

          {/* Attachments list */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs"
                >
                  <Paperclip className="size-3" />
                  <span className="max-w-[150px] truncate">{att.filename}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="ml-1 text-muted-foreground hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 sm:flex-row">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="mr-2 size-4" />
              Attach File (ፋይል አክል)
            </Button>
            <Button
              type="submit"
              disabled={sending}
              className="w-full px-10 py-4 text-lg font-bold shadow-lg sm:w-auto"
            >
              <Send className="mr-2 size-5" />
              {sending ? "Sending..." : "Send (ላክ)"}
            </Button>
          </div>

          {message && (
            <p className="text-center text-sm font-semibold text-primary">
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Footer tip */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Info className="size-4" />
        <span>Your email will be saved automatically in Drafts.</span>
      </div>
    </div>
  );
}

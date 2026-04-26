import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { EmailItem } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

export default function SentPage() {
  const { token } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["sent", token],
    queryFn: () => apiClient.fetchSent(token!),
    enabled: !!token,
  });

  const items: EmailItem[] = data?.items || [];

  const handleDownload = async (
    emailId: string,
    filename: string,
    mimeType: string,
  ) => {
    if (!token) return;
    try {
      setDownloadingId(filename);
      const res = await apiClient.downloadSentAttachment(
        token,
        emailId,
        filename,
      );

      const byteCharacters = atob(res.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download attachment:", err);
      alert("Failed to download attachment.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-2 animate-pulse rounded-full bg-primary" />
        <p className="ml-2 text-sm text-muted-foreground">Loading sent emails...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">
          Sent Emails / የተላኩ ኢሜይሎች
        </h1>
        <p className="mt-1 text-muted-foreground">
          View all the messages you have sent.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
          <p className="text-sm font-bold">No sent emails found.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start composing to see your sent emails here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const isExpanded = expandedId === item._id;

            return (
              <article
                key={item._id}
                className={`group relative flex cursor-pointer flex-col gap-1 rounded-xl border-l-4 bg-card p-4 shadow-sm transition-all hover:shadow-md ${
                  isExpanded ? "border-l-primary" : "border-l-transparent"
                }`}
                onClick={() =>
                  setExpandedId(isExpanded ? null : item._id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Send className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold">
                        To: {item.recipient}
                      </h3>
                      <p className="truncate text-xs font-semibold text-primary">
                        {item.subject}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {isExpanded ? (
                  <div
                    className="mt-4 border-t border-border pt-4 text-sm whitespace-pre-wrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.body || "(No content)"}

                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Attachments
                        </p>
                        {item.attachments.map((att) => (
                          <div
                            key={att.filename}
                            className="flex items-center justify-between rounded-md border border-border bg-secondary/50 p-2"
                          >
                            <span className="mr-4 truncate text-sm">
                              {att.filename} (
                              {Math.round(att.size / 1024)} KB)
                            </span>
                            <button
                              onClick={() =>
                                handleDownload(
                                  item._id,
                                  att.filename,
                                  att.mimeType,
                                )
                              }
                              disabled={downloadingId === att.filename}
                              className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                              {downloadingId === att.filename
                                ? "Downloading..."
                                : "Download"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="line-clamp-2">
                      {item.body || "(No content)"}
                    </p>
                    {item.attachments && item.attachments.length > 0 && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary">
                        <Paperclip className="size-3" />
                        {item.attachments.length} attachment(s)
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

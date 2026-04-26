import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { InboxItem } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import { useState } from "react";

export default function InboxPage() {
  const { token } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["inbox", token],
    queryFn: () => apiClient.fetchInbox(token!),
    enabled: !!token,
  });

  const items: InboxItem[] = data?.items || [];

  const handleDownload = async (
    messageId: string,
    attachmentId: string,
    filename: string,
    mimeType: string,
  ) => {
    if (!token) return;
    try {
      setDownloadingId(attachmentId);
      const res = await apiClient.downloadInboxAttachment(
        token,
        messageId,
        attachmentId,
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

  const getInitials = (name: string) => {
    const parts = name.replace(/<.*>/g, "").trim().split(" ");
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-2 animate-pulse rounded-full bg-primary" />
        <p className="ml-2 text-sm text-muted-foreground">
          Loading inbox...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">
          Inbox / ገቢ መልዕክት
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your recent emails synced from Gmail.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
          <p className="text-sm font-bold">No emails found.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your inbox is empty or still syncing.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const isExpanded = expandedId === item.messageId;
            const initials = getInitials(item.sender);

            return (
              <article
                key={item.messageId}
                className={`group relative flex cursor-pointer flex-col gap-1 rounded-xl border-l-4 bg-card p-4 shadow-sm transition-all hover:shadow-md ${
                  isExpanded
                    ? "border-l-primary"
                    : "border-l-transparent"
                }`}
                onClick={() =>
                  setExpandedId(isExpanded ? null : item.messageId)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {initials || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold">
                        {item.sender}
                      </h3>
                      <p className="truncate text-xs font-semibold text-primary">
                        {item.subject}
                      </p>
                    </div>
                  </div>
                </div>

                {isExpanded ? (
                  <div
                    className="mt-4 border-t border-border pt-4 text-sm whitespace-pre-wrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-2 text-xs text-muted-foreground break-all">
                      <strong>To:</strong> {item.recipient}
                    </div>
                    {item.snippet || "(No content)"}

                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Attachments
                        </p>
                        {item.attachments.map((att) => (
                          <div
                            key={att.attachmentId || att.filename}
                            className="flex items-center justify-between rounded-md border border-border bg-secondary/50 p-2"
                          >
                            <span className="mr-4 truncate text-sm">
                              {att.filename} (
                              {Math.round(att.size / 1024)} KB)
                            </span>
                            <button
                              onClick={() =>
                                att.attachmentId &&
                                handleDownload(
                                  item.messageId,
                                  att.attachmentId,
                                  att.filename,
                                  att.mimeType,
                                )
                              }
                              disabled={
                                !att.attachmentId ||
                                downloadingId === att.attachmentId
                              }
                              className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                              {downloadingId === att.attachmentId
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
                      {item.snippet || "(No content)"}
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

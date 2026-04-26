import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { InboxItem } from "@/lib/api/types";
import { useEffect, useState } from "react";

export default function InboxPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await apiClient.fetchInbox(token);
        setItems(response.items || []);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Inbox | ገቢ መልዕክት</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.messageId}
            onClick={() => setExpandedId(expandedId === item.messageId ? null : item.messageId)}
            className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <p className="font-bold">{item.sender}</p>
              <p className="text-sm text-primary font-semibold">
                {item.subject || "(No subject)"}
              </p>
            </div>
            {expandedId === item.messageId ? (
              <div className="mt-4 border-t pt-4 text-sm whitespace-pre-wrap text-foreground">
                <div className="mb-2 text-xs text-muted-foreground break-all">
                  <strong>To:</strong> {item.recipient}
                </div>
                {item.snippet || "(No content)"}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {item.snippet || "(No content)"}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

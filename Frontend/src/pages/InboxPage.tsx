import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { InboxItem } from "@/lib/api/types";
import { useEffect, useState } from "react";

export default function InboxPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

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
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold">{item.sender}</p>
              <p className="text-xs text-muted-foreground">
                {item.subject || "(No subject)"}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{item.snippet}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

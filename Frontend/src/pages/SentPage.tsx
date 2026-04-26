import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { EmailItem } from "@/lib/api/types";
import { useEffect, useState } from "react";

export default function SentPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<EmailItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        return;
      }

      const response = await apiClient.fetchSent(token);
      setItems(response.items || []);
    };

    void load();
  }, [token]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Sent Emails | የተላኩ መልዕክቶች</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item._id}
            onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
            className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold">To: {item.recipient}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-primary font-semibold">{item.subject}</p>
            {expandedId === item._id ? (
              <div className="mt-4 border-t pt-4 text-sm whitespace-pre-wrap text-foreground">
                {item.body || "(No content)"}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {item.body || "(No content)"}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { EmailItem } from "@/lib/api/types";
import { useEffect, useState } from "react";

export default function SentPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<EmailItem[]>([]);

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
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-bold">To: {item.recipient}</p>
            <p className="text-sm text-primary">{item.subject}</p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

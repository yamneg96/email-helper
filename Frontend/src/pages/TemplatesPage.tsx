import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { AppLanguage, TemplateItem } from "@/lib/api/types";
import React, { useEffect, useState } from "react";

export default function TemplatesPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!token) {
      return;
    }

    const response = await apiClient.getTemplates(token);
    setItems(response.items || []);
  };

  useEffect(() => {
    void load();
  }, [token]);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !user) {
      return;
    }

    setSaving(true);
    try {
      await apiClient.createTemplate(token, {
        name,
        subject,
        body,
        language: (user.language || "en") as AppLanguage,
      });
      setName("");
      setSubject("");
      setBody("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!token) {
      return;
    }

    await apiClient.deleteTemplate(token, id);
    await load();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Templates / ቅጾች</h1>
        <p className="text-sm text-muted-foreground">
          Create reusable email templates in English or Amharic.
        </p>
      </header>

      <form
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        onSubmit={onCreate}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name"
          required
        />
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
        />
        <textarea
          className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 focus-visible:ring-[3px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Template body"
          required
        />
        <Button disabled={saving} type="submit">
          {saving ? "Saving..." : "New Template / አዲስ ቅጽ"}
        </Button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item._id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-bold">{item.name}</p>
            <p className="text-sm text-primary">{item.subject}</p>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {item.body}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {item.language.toUpperCase()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item._id)}
                type="button"
              >
                Delete / ሰርዝ
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

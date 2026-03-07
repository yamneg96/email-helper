import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { InboxItem, TemplateItem } from "@/lib/api/types";
import { Inbox, MailPlus, Send, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        return;
      }

      const [inboxResponse, templateResponse] = await Promise.all([
        apiClient.fetchInbox(token),
        apiClient.getTemplates(token),
      ]);
      setInbox(inboxResponse.items || []);
      setTemplates(templateResponse.items || []);
    };

    void load();
  }, [token]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black">Welcome, {user?.name}! / ሰላም!</h1>
        <p className="text-muted-foreground">
          What would you like to do today? / ዛሬ ምን ማድረግ ይፈልጋሉ?
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          to="/compose"
          title="Compose"
          am="ኢሜይል ጻፍ"
          icon={MailPlus}
        />
        <ActionCard to="/inbox" title="Inbox" am="ገቢ መልዕክት" icon={Inbox} />
        <ActionCard
          to="/templates"
          title="Templates"
          am="ቅጾች"
          icon={FileText}
        />
        <ActionCard to="/sent" title="Sent" am="የተላኩ" icon={Send} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inbox Summary / የገቢ መልዕክት ማጠቃለያ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-primary">{inbox.length}</p>
            <p className="text-sm text-muted-foreground">
              Recent inbox messages synced from Gmail API.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Templates / ቅጾች</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-primary">
              {templates.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Reusable bilingual templates saved for quick composing.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ActionCard({
  to,
  title,
  am,
  icon: Icon,
}: {
  to: string;
  title: string;
  am: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      className="rounded-xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-lg"
      to={to}
    >
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{am}</p>
    </Link>
  );
}

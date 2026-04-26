import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import {
  SquarePen,
  Send,
  Sparkles,
  Mail,
  Bot,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { token, user } = useAuth();

  const { data: inboxData } = useQuery({
    queryKey: ["inbox", token],
    queryFn: () => apiClient.fetchInbox(token!),
    enabled: !!token,
  });

  const { data: templateData } = useQuery({
    queryKey: ["templates", token],
    queryFn: () => apiClient.getTemplates(token!),
    enabled: !!token,
  });

  const inboxCount = inboxData?.items?.length ?? 0;
  const templateCount = templateData?.items?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Welcome, {user?.name}! / ሰላም!
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          What would you like to do today? / ዛሬ ምን ማድረግ ይፈልጋሉ?
        </p>
      </header>

      {/* Action Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          to="/compose"
          title="Compose Email"
          am="ኢሜይል ጻፍ"
          description="Start writing a new message from scratch."
          icon={SquarePen}
        />
        <ActionCard
          to="/inbox"
          title="Inbox"
          am="የገቡ መልእክቶች"
          description="Check and read the messages you have received."
          icon={Mail}
        />
        <ActionCard
          to="/templates"
          title="Templates"
          am="ቅጽ"
          description="Use pre-written drafts to save time."
          icon={Sparkles}
        />
        <ActionCard
          to="/sent"
          title="Sent Emails"
          am="የተላኩ መልእክቶች"
          description="View all the messages you have sent out."
          icon={Send}
        />
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="size-3 rounded-full bg-green-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              System Status
            </p>
            <p className="text-sm font-medium">Assistant is online and ready</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{inboxCount}</p>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              New Emails
            </p>
          </div>
          <div className="border-l border-border pl-8 text-center">
            <p className="text-2xl font-bold text-primary">{templateCount}</p>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Templates
            </p>
          </div>
        </div>
        <Link
          to="/settings"
          className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
        >
          Quick Help
        </Link>
      </div>

      {/* AI Banner */}
      <div className="relative flex h-48 items-center overflow-hidden rounded-2xl bg-primary/5 px-10">
        <div className="relative z-10 max-w-md">
          <h3 className="text-2xl font-bold">AI-Powered Assistance</h3>
          <p className="mt-2 text-muted-foreground">
            Our smart assistant helps you write better emails in English and
            Amharic automatically.
          </p>
        </div>
        <div className="absolute bottom-0 right-0 top-0 flex w-1/3 items-center justify-center opacity-10">
          <Bot className="size-48" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  to,
  title,
  am,
  description,
  icon: Icon,
}: {
  to: string;
  title: string;
  am: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      className="group flex flex-col items-start rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
      to={to}
    >
      <div className="mb-6 flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-7" />
      </div>
      <h3 className="mb-1 text-xl font-bold">{title}</h3>
      <h4 className="mb-2 text-lg font-medium text-primary">{am}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

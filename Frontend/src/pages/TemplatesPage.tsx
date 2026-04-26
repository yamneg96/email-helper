import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { AppLanguage } from "@/lib/api/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  Smile,
  Upload,
  Clock,
  Plus,
  Search,
  Trash2,
  FileText,
  ClipboardList,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All Templates",
  "Career",
  "Academic",
  "Meeting",
  "Personal",
  "Report",
];

const CATEGORY_CONFIG: Record<
  string,
  {
    gradient: string;
    textColor: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Career: {
    gradient: "from-primary/10 to-primary/30",
    textColor: "text-primary",
    bgColor: "bg-primary/10",
    icon: Briefcase,
  },
  Meeting: {
    gradient: "from-emerald-500/10 to-emerald-500/30",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    icon: Calendar,
  },
  Personal: {
    gradient: "from-orange-500/10 to-orange-500/30",
    textColor: "text-orange-600",
    bgColor: "bg-orange-500/10",
    icon: Smile,
  },
  Academic: {
    gradient: "from-indigo-500/10 to-indigo-500/30",
    textColor: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
    icon: Upload,
  },
  Report: {
    gradient: "from-rose-500/10 to-rose-500/30",
    textColor: "text-rose-600",
    bgColor: "bg-rose-500/10",
    icon: ClipboardList,
  },
};

function getConfig(lang: string) {
  // Map based on template language or name keywords
  return (
    CATEGORY_CONFIG[lang] || {
      gradient: "from-slate-500/10 to-slate-500/30",
      textColor: "text-slate-600",
      bgColor: "bg-slate-500/10",
      icon: FileText,
    }
  );
}

function detectCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("report") || lower.includes("status")) return "Report";
  if (lower.includes("job") || lower.includes("career") || lower.includes("application")) return "Career";
  if (lower.includes("meeting") || lower.includes("schedule")) return "Meeting";
  if (lower.includes("greeting") || lower.includes("hello") || lower.includes("personal")) return "Personal";
  if (lower.includes("file") || lower.includes("submission") || lower.includes("academic")) return "Academic";
  return "Career";
}

export default function TemplatesPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["templates", token],
    queryFn: () => apiClient.getTemplates(token!),
    enabled: !!token,
  });

  const items = data?.items || [];

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; subject: string; body: string; language: AppLanguage }) =>
      apiClient.createTemplate(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setName("");
      setSubject("");
      setBody("");
      setShowCreate(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTemplate(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !user) return;
    createMutation.mutate({
      name,
      subject,
      body,
      language: (user.language || "en") as AppLanguage,
    });
  };

  const onUseTemplate = (item: { subject: string; body: string }) => {
    navigate("/compose", {
      state: { subject: item.subject, body: item.body },
    });
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeFilter === "All Templates" ||
      detectCategory(item.name) === activeFilter;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-2 animate-pulse rounded-full bg-primary" />
        <p className="ml-2 text-sm text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight">
            Email Templates
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a professionally crafted template to get started with your
            email. All templates are beginner-friendly and bilingual.
          </p>
        </div>
        <Button
          className="font-bold shadow-lg"
          onClick={() => setShowCreate(!showCreate)}
        >
          <Plus className="mr-2 size-4" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Create Form */}
      {showCreate && (
        <form
          className="space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={onCreate}
        >
          <h3 className="text-lg font-bold">Create New Template</h3>
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
            className="min-h-[140px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Template body"
            required
          />
          <div className="flex gap-2">
            <Button disabled={createMutation.isPending} type="submit">
              {createMutation.isPending ? "Saving..." : "Create Template"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeFilter === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((item) => {
          const cat = detectCategory(item.name);
          const config = getConfig(cat);
          const IconComp = config.icon;

          return (
            <div
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 sm:flex-row"
            >
              <div className="relative h-48 overflow-hidden bg-secondary sm:h-auto sm:w-1/3">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} transition-transform duration-500 group-hover:scale-110`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconComp
                    className={`size-12 ${config.textColor} opacity-60`}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between p-6 sm:w-2/3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.bgColor} ${config.textColor}`}
                    >
                      {cat}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{item.name}</h3>
                  <p className="mb-4 line-clamp-3 text-sm italic leading-relaxed text-muted-foreground">
                    "{item.body}"
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Clock className="size-3" /> 1 min read
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(item._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    <Button size="sm" onClick={() => onUseTemplate(item)}>
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No templates found.</p>
        </div>
      )}
    </div>
  );
}

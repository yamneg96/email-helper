import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  X,
  CheckCircle,
  Paperclip,
  Send,
  ArrowRight,
  FileEdit,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    title: "How to write email",
    am: "ኢሜይል እንዴት መጻፍ እንደሚቻል",
    text: "Click the 'Compose' button to start. Keep your subject line brief and your message clear.",
    icon: FileEdit,
    checklist: ["Add recipient email address", "Write a helpful subject"],
  },
  {
    title: "Attach files",
    am: "ፋይሎችን ማያያዝ",
    text: "You can upload documents, images, or any files while composing your message. Click the 'Attach File' button.",
    icon: Paperclip,
    checklist: ["Select files from your device", "Review attachments before sending"],
  },
  {
    title: "Send and Track",
    am: "ላክ እና ተከታተል",
    text: "Hit the Send button when ready. Check your Inbox for replies and the Sent folder to review what you've sent.",
    icon: Send,
    checklist: ["Check Inbox for new messages", "Review Sent folder for history"],
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();
  const [index, setIndex] = useState(0);
  const step = useMemo(() => STEPS[index], [index]);
  const progress = ((index + 1) / STEPS.length) * 100;

  const onFinish = async () => {
    if (!token) return;

    await apiClient.updateSettings(token, {
      onboardingStep: 3,
      onboardingCompleted: true,
    });
    await refreshUser();
    navigate("/dashboard");
  };

  const onSkip = async () => {
    await onFinish();
  };

  const StepIcon = step.icon;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Mail className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Email Assistant
              </h1>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Welcome Guide
              </p>
            </div>
          </div>
          <button
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={onSkip}
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm font-semibold text-primary">
                Step {index + 1} of {STEPS.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Illustration */}
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-primary/20 md:w-1/2">
              <StepIcon className="size-20 text-primary transition-transform duration-500 group-hover:scale-110" />
            </div>

            {/* Text */}
            <div className="w-full space-y-4 md:w-1/2">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Active Step
              </div>
              <h2 className="text-2xl font-bold leading-tight">
                {step.title}
                <br />
                <span className="font-medium text-primary/80">{step.am}</span>
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {step.text}
              </p>
              <div className="pt-2">
                <ul className="space-y-2">
                  {step.checklist.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="size-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Preview cards */}
          {index === 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-8">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground">
                  <Paperclip className="size-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-bold">Attach Files</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    ፋይሎችን ማያያዝ
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground">
                  <Send className="size-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-bold">Send Email</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    ኢሜይል መላክ
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="flex flex-col items-center justify-between gap-4 bg-secondary/50 px-8 py-6 sm:flex-row">
          <button
            className="w-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:w-auto"
            onClick={onSkip}
          >
            Skip Tutorial
          </button>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex((x) => x - 1)}
              className="flex-1 sm:flex-none"
            >
              Previous
            </Button>
            {index < STEPS.length - 1 ? (
              <Button
                onClick={() => setIndex((x) => x + 1)}
                className="flex-1 gap-2 sm:flex-none"
              >
                Next Step
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={onFinish} className="flex-1 sm:flex-none">
                Finish / ጨርስ
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

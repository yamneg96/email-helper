import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    title: "How to write email",
    am: "ኢሜይል እንዴት መጻፍ እንደሚቻል",
    text: "Use Compose to add recipient, subject, and message.",
  },
  {
    title: "Attach files",
    am: "ፋይሎችን ማያያዝ",
    text: "You can upload files while composing your message.",
  },
  {
    title: "Send and Track",
    am: "ላክ እና ተከታተል",
    text: "Check Inbox and Sent after sending your message.",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();
  const [index, setIndex] = useState(0);
  const step = useMemo(() => STEPS[index], [index]);

  const onFinish = async () => {
    if (!token) {
      return;
    }

    await apiClient.updateSettings(token, {
      onboardingStep: 3,
      onboardingCompleted: true,
    });
    await refreshUser();
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card shadow-lg">
      <div className="border-b border-border p-6">
        <p className="text-sm font-semibold text-primary">
          Step {index + 1} of 3
        </p>
        <div className="mt-2 h-2 rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${((index + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 p-8">
        <h1 className="text-3xl font-bold">{step.title}</h1>
        <p className="text-lg text-primary">{step.am}</p>
        <p className="text-muted-foreground">{step.text}</p>
      </div>

      <div className="flex justify-between border-t border-border p-6">
        <Button
          disabled={index === 0}
          variant="outline"
          onClick={() => setIndex((x) => x - 1)}
        >
          Previous
        </Button>
        {index < STEPS.length - 1 ? (
          <Button onClick={() => setIndex((x) => x + 1)}>
            Next Step / ቀጣይ
          </Button>
        ) : (
          <Button onClick={onFinish}>Finish / ጨርስ</Button>
        )}
      </div>
    </div>
  );
}

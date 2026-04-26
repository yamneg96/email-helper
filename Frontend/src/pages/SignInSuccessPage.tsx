import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInSuccessPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    const redirect = setTimeout(() => {
      navigate(user?.onboarding?.completed ? "/dashboard" : "/onboarding");
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate, user]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 md:px-20">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="size-6" />
          <h2 className="text-lg font-bold">Email Assistant</h2>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-border bg-card p-8 shadow-sm">
          {/* Success icon */}
          <div className="relative mb-8">
            <div className="flex size-24 items-center justify-center rounded-full bg-green-50 text-green-500 dark:bg-green-900/20">
              <CheckCircle className="size-16" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground">
              <Sparkles className="size-3.5" />
            </div>
          </div>

          {/* Text */}
          <div className="mb-10 space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome Back! / እንኳን ደህና መጡ!
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              You have successfully signed in. We're preparing your workspace.
            </p>
          </div>

          {/* Progress */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium">Redirecting to dashboard</p>
              <span className="text-sm font-semibold text-primary">
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="size-2 animate-pulse rounded-full bg-primary" />
              <p className="text-xs text-muted-foreground">
                Please wait a moment while we load your data
              </p>
            </div>
          </div>

          {/* Info cards */}
          <div className="mt-12 grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/50 p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Last Login
              </span>
              <span className="text-sm font-medium">Just now</span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/50 p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Security
              </span>
              <span className="text-sm font-medium">Verified</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-6">
          <a
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="#"
          >
            Help Center
          </a>
        </div>
      </main>

      <footer className="border-t border-border p-6 text-center text-sm text-muted-foreground">
        © 2024 Email Assistant. All rights reserved.
      </footer>
    </div>
  );
}

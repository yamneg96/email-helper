import { Button } from "@/components/ui/button";
import { Mail, Sparkles, ShieldCheck, Zap } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
              <Mail className="size-5" />
            </div>
            <p className="font-bold">Email Assistant</p>
          </div>
          <Link to="/signin">
            <Button className="font-bold">Get Started / ጀምር</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-12 md:py-20">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <p className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              English + Amharic Support
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Friendly Bilingual Email Assistant
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Write, send, and manage professional emails with a simple
              beginner-first flow. / ለጀማሪዎች ቀላል የሆነ የኢሜይል መረዳት እና አስተዳደር ስርዓት።
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signin">
                <Button size="lg" className="font-bold">
                  Sign In / ይግቡ
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="font-bold">
                  Learn More / ተጨማሪ ይወቁ
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
            <div className="grid gap-4">
              <FeatureCard icon={Sparkles} title="AI Guided" am="በAI የሚመራ" />
              <FeatureCard icon={ShieldCheck} title="Secure" am="ደህንነቱ የተጠበቀ" />
              <FeatureCard icon={Zap} title="Fast" am="ፈጣን" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  am,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  am: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
        <Icon className="size-5" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{am}</p>
    </div>
  );
}

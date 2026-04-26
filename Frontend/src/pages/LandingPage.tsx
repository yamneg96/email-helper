import { Button } from "@/components/ui/button";
import {
  Mail,
  Sparkles,
  ShieldCheck,
  Globe,
  Check,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mail className="size-[18px]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Email Assistant
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-6 md:flex">
              <a
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                href="#about"
              >
                About
              </a>
              <a
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                href="#features"
              >
                Features
              </a>
            </div>
            <ThemeToggleButton />
            <Link to="/signin">
              <Button className="font-bold shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-16 lg:px-20 lg:py-24 overflow-hidden">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Now supporting English & Amharic
              </div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight lg:text-7xl">
                Your Friendly{" "}
                <span className="text-primary">Bilingual</span> Email Assistant
              </h1>
              <p className="max-w-[540px] text-lg leading-relaxed text-muted-foreground">
                Master your inbox with ease. Our AI-guided support is designed
                specifically for beginners, bridging the gap between English and
                Amharic seamlessly.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/signin">
                  <Button
                    size="lg"
                    className="h-14 rounded-xl px-8 text-base font-bold shadow-lg"
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <a href="#about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-xl px-8 text-base font-bold"
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                <div className="flex h-full w-full items-center justify-center rounded-2xl border border-border bg-card shadow-2xl">
                  <div className="text-center p-8">
                    <Mail className="mx-auto size-20 text-primary/30" />
                    <p className="mt-4 text-lg font-bold text-muted-foreground">
                      Smart Email Management
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating status card */}
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-4 shadow-xl md:block">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                    <Check className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </p>
                    <p className="text-sm font-semibold">Email Optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / Mission Section */}
        <section
          className="bg-card px-6 py-20 lg:px-20"
          id="about"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight lg:text-4xl">
              Our Mission
            </h2>
            <p className="text-xl italic leading-relaxed text-muted-foreground">
              "We believe that language should never be a barrier to professional
              communication. Our mission is to empower everyone to express
              themselves clearly and confidently in every email they send."
            </p>
            <div className="mt-12 grid w-full grid-cols-2 gap-8 border-t border-border pt-12 md:grid-cols-4">
              <StatItem value="10k+" label="Active Users" />
              <StatItem value="2" label="Languages Supported" />
              <StatItem value="99%" label="User Satisfaction" />
              <StatItem value="24/7" label="AI Support" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-24 lg:px-20" id="features">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 max-w-2xl">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Core Features
              </h2>
              <h3 className="mb-6 text-4xl font-black tracking-tight">
                Built for simplicity, powered by intelligence.
              </h3>
              <p className="text-lg text-muted-foreground">
                Everything you need to manage your bilingual communications
                without the technical headache.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <FeatureCard
                icon={Sparkles}
                title="Simple to Use"
                description="No complicated setups. Our interface is designed specifically for beginners with clear, intuitive controls."
                color="blue"
              />
              <FeatureCard
                icon={Globe}
                title="Bilingual Support"
                description="Write in Amharic (አማርኛ) or English. We provide instant translation and grammar checks for both languages."
                color="purple"
              />
              <FeatureCard
                icon={ShieldCheck}
                title="AI Guided"
                description="Smart suggestions help you phrase professional emails. We guide you step-by-step through the composition."
                color="amber"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground/95 px-8 py-20 text-center text-background lg:px-20">
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute -left-20 -top-20 size-64 rounded-full bg-primary blur-[100px]" />
                <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-primary blur-[100px]" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight lg:text-5xl">
                  Ready to simplify your emails?
                </h2>
                <p className="max-w-xl text-lg opacity-70">
                  Join thousands of users who are already communicating better
                  across borders and languages.
                </p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <Link to="/signin">
                    <Button
                      size="lg"
                      className="h-14 rounded-xl px-10 text-lg font-bold shadow-lg"
                    >
                      Start Your Free Trial
                    </Button>
                  </Link>
                  <Link to="/signin">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 rounded-xl border-background/20 bg-transparent px-10 text-lg font-bold text-background hover:bg-background/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
                <p className="text-sm opacity-50">
                  No credit card required for your first month.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
            <div className="flex max-w-sm flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="size-[18px]" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Email Assistant
                </span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Empowering universal communication with simple, accessible AI
                tools for everyone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:gap-24">
              <FooterColumn
                title="Product"
                links={["Features", "Pricing", "Roadmap"]}
              />
              <FooterColumn
                title="Company"
                links={["About Us", "Contact", "Careers"]}
              />
              <FooterColumn title="Legal" links={["Privacy", "Terms"]} />
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 Email Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-4xl font-black text-primary">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
  };

  return (
    <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`mb-6 inline-flex size-12 items-center justify-center rounded-xl ${colorMap[color]}`}
      >
        <Icon className="size-7" />
      </div>
      <h4 className="mb-3 text-xl font-bold">{title}</h4>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {links.map((link) => (
        <a
          key={link}
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
          href="#"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

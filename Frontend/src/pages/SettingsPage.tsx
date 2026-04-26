import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { AppLanguage } from "@/lib/api/types";
import {
  User,
  Globe,
  Moon,
  Sun,
  LogOut,
  Check,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { token, user, refreshUser, setLanguage, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [theme, setTheme] = useState(user?.theme || "light");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const onSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setMessage("");

    try {
      await apiClient.updateProfile(token, { name });
      await apiClient.updateSettings(token, {
        theme: theme as "light" | "dark" | "system",
      });
      await refreshUser();
      setMessage("Settings saved / ቅንብሮች ተቀምጠዋል");
    } finally {
      setSaving(false);
    }
  };

  const onChangeLanguage = async (language: AppLanguage) => {
    await setLanguage(language);
    setMessage("Language updated / ቋንቋ ተዘምኗል");
  };

  const onSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-8">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black leading-tight tracking-tight">
          Settings / ቅንብሮች
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and preferences. / የመለያዎን ቅንብሮች እዚህ ያስተካክሉ።
        </p>
      </div>

      {/* Profile Section */}
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border p-6">
          <User className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Profile / መገለጫ</h2>
        </div>
        <form className="p-8" onSubmit={onSaveProfile}>
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-primary/10 text-primary">
                  <span className="text-4xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>
            {/* Fields */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name / ሙሉ ስም
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email / ኢሜይል
                </label>
                <Input
                  disabled
                  value={user?.email || ""}
                  className="h-12 cursor-not-allowed bg-secondary/50 text-muted-foreground"
                />
              </div>
              <Button disabled={saving} type="submit" className="w-full md:w-auto">
                {saving ? "Saving..." : "Save Changes / ለውጦችን አስቀምጥ"}
              </Button>
              {message && (
                <p className="text-sm font-semibold text-primary">{message}</p>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* Language Section */}
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border p-6">
          <Globe className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Language / ቋንቋ</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onChangeLanguage("en")}
            className={`flex w-full items-center justify-between rounded-xl border-2 p-6 transition-all ${
              user?.language === "en"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                🇺🇸
              </div>
              <div className="text-left">
                <p className="text-lg font-bold">English</p>
                <p className="text-sm text-muted-foreground">Default System</p>
              </div>
            </div>
            {user?.language === "en" && (
              <Check className="size-5 text-primary" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onChangeLanguage("am")}
            className={`flex w-full items-center justify-between rounded-xl border-2 p-6 transition-all ${
              user?.language === "am"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                🇪🇹
              </div>
              <div className="text-left">
                <p className="text-lg font-bold">Amharic / አማርኛ</p>
                <p className="text-sm text-muted-foreground">አማርኛ ቋንቋ</p>
              </div>
            </div>
            {user?.language === "am" && (
              <Check className="size-5 text-primary" />
            )}
          </button>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border p-6">
          <Moon className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Appearance / ገጽታ</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-4 rounded-xl border-2 p-6 transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-yellow-100">
                <Sun className="size-8 text-yellow-600" />
              </div>
              <div className="text-center">
                <p className="font-bold">Light / ብሩህ</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {theme === "light" ? "Active" : "Select"}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-4 rounded-xl border-2 p-6 transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-foreground/10">
                <Moon className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-bold">Dark / ጨለማ</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {theme === "dark" ? "Active" : "Select"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut className="size-5" />
          Sign Out / ውጣ
        </button>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-2 border-t border-border py-10 opacity-60">
        <p className="text-sm">Email Assistant v2.4.0</p>
        <div className="flex gap-4 text-xs">
          <a className="underline" href="#">
            Privacy / ግላዊነት
          </a>
          <a className="underline" href="#">
            Terms / ደንቦች
          </a>
        </div>
      </footer>
    </div>
  );
}

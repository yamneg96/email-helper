import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { AppLanguage } from "@/lib/api/types";
import React, { useState } from "react";

export default function SettingsPage() {
  const { token, user, refreshUser, setLanguage } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [theme, setTheme] = useState(user?.theme || "system");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const onSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }

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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-black">Settings / ቅንብሮች</h1>
      </header>

      <form
        className="space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={onSaveProfile}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Full Name / ሙሉ ስም
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Email / ኢሜይል
          </label>
          <Input disabled value={user?.email || ""} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Theme / ገጽታ
          </label>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((themeOption) => (
              <Button
                key={themeOption}
                type="button"
                variant={theme === themeOption ? "default" : "outline"}
                onClick={() => setTheme(themeOption)}
              >
                {themeOption}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Language / ቋንቋ
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={user?.language === "en" ? "default" : "outline"}
              onClick={() => onChangeLanguage("en")}
            >
              English
            </Button>
            <Button
              type="button"
              variant={user?.language === "am" ? "default" : "outline"}
              onClick={() => onChangeLanguage("am")}
            >
              አማርኛ
            </Button>
          </div>
        </div>

        <Button disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Changes / አስቀምጥ"}
        </Button>

        {message ? (
          <p className="text-sm font-semibold text-primary">{message}</p>
        ) : null}
      </form>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Mail } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState("New User");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, name || "New User");
      navigate("/signin-success");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Sign in failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <div className="mx-auto inline-flex rounded-xl bg-primary/10 p-3 text-primary">
            <Mail className="size-8" />
          </div>
          <h1 className="text-2xl font-bold">Sign In / ይግቡ</h1>
          <p className="text-sm text-muted-foreground">
            Google-style quick login for demo backend integration.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Name / ስም</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Abebe Kebede"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Email / ኢሜይል</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button
            className="h-12 w-full text-base font-bold"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Sign in with Google / በGoogle ይግቡ"}
          </Button>
        </form>
      </div>
    </div>
  );
}

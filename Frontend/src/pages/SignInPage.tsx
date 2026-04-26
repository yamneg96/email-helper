import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Mail, ShieldCheck } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="size-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Email Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent inbox companion / የእርስዎ ብልህ የኢሜል ረዳት
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-semibold">Sign In / ይግቡ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Access your account to get started / ለመጀመር ወደ መለያዎ ይግቡ
              </p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name / ስም</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abebe Kebede"
                  className="h-12"
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
                  className="h-12"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : null}

              <Button
                className="h-12 w-full text-base font-bold"
                disabled={loading}
                type="submit"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in with Google / በGoogle ይግቡ"}
              </Button>
            </form>
          </div>

          {/* Privacy Footer */}
          <div className="border-t border-border bg-secondary/50 p-6">
            <div className="flex gap-3">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="mb-1 block font-semibold">
                    Privacy & Security / ግላዊነት እና ደህንነት
                  </span>
                  Your data is protected with industry-standard encryption. We
                  never share your personal information or email content with
                  third parties.
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  የእርስዎ ውሂብ በኢንዱስትሪ ደረጃ ምስጠራ የተጠበቀ ነው። የግል መረጃዎን ወይም
                  የኢሜል ይዘትዎን ለሶስተኛ ወገኖች ፈጽሞ አናጋራም።
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
          <br />
          በመግባትዎ በአገልግሎት ውላችን እና በግላዊነት መመሪያችን ይስማማሉ።
        </p>
      </div>
    </div>
  );
}

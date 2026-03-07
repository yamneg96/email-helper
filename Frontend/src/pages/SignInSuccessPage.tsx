import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

export default function SignInSuccessPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const nextPath = user.onboarding.completed ? "/dashboard" : "/onboarding";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-green-500/10 p-4 text-green-600">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="text-3xl font-bold">Welcome Back / እንኳን ደህና መጡ</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Login completed. Continue to your guided workspace setup.
        </p>
        <Button
          className="mt-6 h-11 w-full font-bold"
          onClick={() => navigate(nextPath)}
        >
          Continue / ቀጥል
        </Button>
      </div>
    </div>
  );
}

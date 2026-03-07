import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import ComposePage from "@/pages/ComposePage";
import DashboardPage from "@/pages/DashboardPage";
import InboxPage from "@/pages/InboxPage";
import LandingPage from "@/pages/LandingPage";
import OnboardingPage from "@/pages/OnboardingPage";
import SentPage from "@/pages/SentPage";
import SettingsPage from "@/pages/SettingsPage";
import SignInPage from "@/pages/SignInPage";
import SignInSuccessPage from "@/pages/SignInSuccessPage";
import TemplatesPage from "@/pages/TemplatesPage";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user && !user.onboarding.completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signin-success" element={<SignInSuccessPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background p-4 md:p-10">
              <OnboardingPage />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <OnboardingGate>
              <AppShell />
            </OnboardingGate>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/compose" element={<ComposePage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/sent" element={<SentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

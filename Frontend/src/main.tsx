import { AuthProvider } from "@/context/AuthContext";
import { useThemeStore } from "@/shared/hooks/useThemeStore";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

function ThemeBootstrap() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeBootstrap />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

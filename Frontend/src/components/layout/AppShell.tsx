import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Send,
  Settings,
  SquarePen,
  LayoutGrid,
  Files,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", am: "ዳሽቦርድ", icon: LayoutGrid },
  { to: "/inbox", label: "Inbox", am: "ገቢ መልዕክት", icon: Mail },
  { to: "/compose", label: "Compose", am: "ኢሜይል ጻፍ", icon: SquarePen },
  { to: "/templates", label: "Templates", am: "ቅጾች", icon: Files },
  { to: "/sent", label: "Sent", am: "የተላኩ", icon: Send },
];

export default function AppShell() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card
          flex flex-col transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <Link
            className="flex items-center gap-3"
            to="/dashboard"
            onClick={closeSidebar}
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Mail className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">
                Email Assistant
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Beginner Friendly
              </p>
            </div>
          </Link>
          <button
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary md:hidden"
            onClick={closeSidebar}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`
              }
            >
              <item.icon className="size-[18px]" />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-[11px] opacity-70">{item.am}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border p-4">
          <NavLink
            to="/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary"
              }`
            }
          >
            <Settings className="size-[18px]" />
            <div>
              <p className="text-sm font-semibold">Settings</p>
              <p className="text-[11px] opacity-70">ቅንብሮች</p>
            </div>
          </NavLink>

          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <ThemeToggleButton />
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <p className="text-sm text-muted-foreground">
              Welcome / እንኳን ደህና መጡ
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="size-3.5" />
            Sign Out / ውጣ
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

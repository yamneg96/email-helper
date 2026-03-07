import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Send,
  Settings,
  SquarePen,
  LayoutGrid,
  Files,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", am: "ዳሽቦርድ", icon: LayoutGrid },
  { to: "/inbox", label: "Inbox", am: "ገቢ መልዕክት", icon: Mail },
  { to: "/compose", label: "Compose", am: "ኢሜይል ጻፍ", icon: SquarePen },
  { to: "/templates", label: "Templates", am: "ቅጾች", icon: Files },
  { to: "/sent", label: "Sent", am: "የተላኩ", icon: Send },
  { to: "/settings", label: "Settings", am: "ቅንብሮች", icon: Settings },
];

export default function AppShell() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const onSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-col md:min-h-screen md:flex-row">
        <aside className="w-full border-b border-border bg-card md:w-72 md:border-r md:border-b-0">
          <div className="p-6">
            <Link className="flex items-center gap-3" to="/dashboard">
              <div className="rounded-xl bg-primary p-2 text-primary-foreground">
                <Mail className="size-5" />
              </div>
              <div>
                <h1 className="font-bold">Email Assistant</h1>
                <p className="text-xs text-muted-foreground">
                  Beginner Friendly
                </p>
              </div>
            </Link>
          </div>

          <nav className="grid gap-1 px-4 pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4" />
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[11px]">{item.am}</p>
                  </div>
                </div>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-between border-t border-border p-4">
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <ThemeToggleButton />
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-8">
            <p className="text-sm text-muted-foreground">
              Welcome / እንኳን ደህና መጡ
            </p>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-lg border border-border px-3 py-1 text-xs font-semibold hover:bg-secondary"
            >
              Sign Out / ውጣ
            </button>
          </header>
          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, LogOut } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useTheme } from "@/lib/theme";
import { useSession, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user } = useSession();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="MystiChef logo" className="h-9 w-9 rounded-lg object-cover ring-1 ring-border" />
          <span className="text-lg font-bold tracking-tight">MystiChef</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#how" className="hover:text-foreground transition">How it works</a>
          <a href="/#features" className="hover:text-foreground transition">Features</a>
          <a href="/#pricing" className="hover:text-foreground transition">Pricing</a>
          {user && <Link to="/dashboard" className="hover:text-foreground transition">Dashboard</Link>}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary transition"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "login" }} className="text-sm font-medium px-3 py-2 hover:text-foreground text-muted-foreground">
                Login
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 transition"
                style={{ background: "var(--gradient-warm)" }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
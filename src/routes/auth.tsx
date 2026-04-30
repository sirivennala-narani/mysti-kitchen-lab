import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, login, loginWithGoogle } from "@/lib/auth";
import logo from "@/assets/logo.jpg";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional().default("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — MystiChef" },
      { name: "description", content: "Log in or create your MystiChef account to start cooking and learning." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        const schema = z.object({
          name: z.string().trim().min(2, "Name is too short").max(80),
          email: z.string().trim().email("Invalid email").max(255),
          password: z.string().min(6, "Password must be at least 6 characters").max(100),
          confirm: z.string(),
        }).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
        const parsed = schema.parse({ name, email, password, confirm });
        setLoading(true);
        await signup(parsed.name, parsed.email, parsed.password);
      } else {
        const schema = z.object({
          email: z.string().trim().email("Invalid email"),
          password: z.string().min(1, "Password required"),
        });
        const parsed = schema.parse({ email, password });
        setLoading(true);
        await login(parsed.email, parsed.password);
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (err instanceof z.ZodError) setError(err.issues[0].message);
      else setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError("");
    try {
      const res = await loginWithGoogle();
      if (res?.error) {
        setError(res.error instanceof Error ? res.error.message : String(res.error));
        return;
      }
      if (!res?.redirected) navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-card)]">
            <div className="flex flex-col items-center text-center mb-6">
              <img src={logo} alt="" className="h-12 w-12 rounded-xl object-cover ring-1 ring-border mb-3" />
              <h1 className="text-2xl font-bold">{isSignup ? "Create your account" : "Welcome back"}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignup ? "Start cooking the unknown today" : "Log in to continue your journey"}
              </p>
            </div>

            <div className="grid grid-cols-2 p-1 bg-muted rounded-full mb-6 text-sm font-medium">
              <Link to="/auth" search={{ mode: "login" }} className={`text-center py-2 rounded-full transition ${!isSignup ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                Login
              </Link>
              <Link to="/auth" search={{ mode: "signup" }} className={`text-center py-2 rounded-full transition ${isSignup ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                Sign up
              </Link>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              {isSignup && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full text-primary-foreground border-0 hover:opacity-90"
                style={{ background: "var(--gradient-warm)" }}
              >
                {isSignup ? "Create account" : "Log in"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              onClick={onGoogle}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1A6.99 6.99 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Secured by Lovable Cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
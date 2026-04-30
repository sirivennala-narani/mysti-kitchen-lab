import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth";
import { listRecipes, type Recipe } from "@/services/recipes";
import { listProgress, setCompleted as setCompletedDb } from "@/services/progress";
import { Check, ChefHat, Clock, Search, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MystiChef" },
      { name: "description", content: "Your mystery recipes, progress, and learning topics." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, ready } = useSession();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [ready, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    Promise.all([listRecipes(search || undefined), listProgress(user.id)])
      .then(([rs, prog]) => {
        if (!active) return;
        setRecipes(rs);
        setCompleted(prog.filter((p) => p.completed).map((p) => p.recipe_id));
      })
      .catch((e) => console.error("[dashboard load]", e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user, search]);

  if (!user) return null;

  const onToggle = async (id: string) => {
    const isDone = completed.includes(id);
    setCompleted((prev) => (isDone ? prev.filter((x) => x !== id) : [...prev, id]));
    try {
      await setCompletedDb(user.id, id, !isDone);
    } catch (e) {
      console.error(e);
      // revert
      setCompleted((prev) => (isDone ? [...prev, id] : prev.filter((x) => x !== id)));
    }
  };
  const total = recipes.length || 1;
  const progress = Math.round((completed.length / total) * 100);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
              Hey, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-2">Pick a mystery recipe and let's cook some science.</p>
          </div>
          <div className="flex gap-3">
            <StatCard icon={<Trophy className="h-4 w-4" />} label="Completed" value={`${completed.length}/${recipes.length}`} />
            <StatCard icon={<Sparkles className="h-4 w-4" />} label="Progress" value={`${progress}%`} />
            <StatCard icon={<ChefHat className="h-4 w-4" />} label="Plan" value="Free" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 mb-10 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Your learning journey</p>
            <p className="text-xs text-muted-foreground">{completed.length} of {recipes.length} recipes</p>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--gradient-warm)" }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">This week's mystery recipes</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes…"
              className="pl-9 rounded-full"
            />
          </div>
        </div>
        {loading && <p className="text-sm text-muted-foreground">Loading recipes…</p>}
        {!loading && recipes.length === 0 && (
          <p className="text-sm text-muted-foreground">No recipes found.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((r) => {
            const done = completed.includes(r.id);
            return (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{r.emoji}</div>
                  {done && (
                    <Badge className="bg-primary/10 text-primary border-0">
                      <Check className="h-3 w-3 mr-1" /> Done
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-lg leading-tight">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.theme}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {r.time}</span>
                  <span>•</span>
                  <span>{r.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {r.topics.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <Button asChild size="sm" className="flex-1 rounded-full text-primary-foreground border-0" style={{ background: "var(--gradient-warm)" }}>
                    <Link to="/recipe/$recipeId" params={{ recipeId: r.id }}>Start cooking</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => onToggle(r.id)}>
                    {done ? "Undo" : "Mark done"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[110px] shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}
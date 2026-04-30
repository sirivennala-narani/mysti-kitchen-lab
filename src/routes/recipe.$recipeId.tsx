import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth";
import { getRecipeWithSteps, type RecipeWithSteps } from "@/services/recipes";
import { listProgress, setCompleted as setCompletedDb, setCurrentStep } from "@/services/progress";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Sparkles } from "lucide-react";

export const Route = createFileRoute("/recipe/$recipeId")({
  head: () => ({
    meta: [
      { title: "Recipe — MystiChef" },
      { name: "description", content: "AR cooking recipe" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p>Recipe not found. <Link to="/dashboard" className="underline">Back to dashboard</Link></p>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  component: RecipePage,
});

function RecipePage() {
  const { recipeId } = Route.useParams();
  const { user, ready } = useSession();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeWithSteps | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [ready, user, navigate]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getRecipeWithSteps(recipeId)
      .then((r) => {
        if (active) setRecipe(r);
      })
      .catch((e) => console.error("[recipe load]", e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [recipeId]);

  useEffect(() => {
    if (!user) return;
    listProgress(user.id)
      .then((rows) => {
        const me = rows.find((r) => r.recipe_id === recipeId);
        if (me) {
          setDone(me.completed);
          setStep(me.current_step ?? 0);
        }
      })
      .catch((e) => console.error(e));
  }, [user, recipeId]);

  if (!user) return null;
  if (loading || !recipe) {
    return (
      <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading recipe…
        </div>
      </div>
    );
  }
  if (recipe.steps.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          This recipe has no steps yet.
        </div>
      </div>
    );
  }
  const total = recipe.steps.length;
  const current = recipe.steps[step];
  const pct = Math.round(((step + 1) / total) * 100);

  const goStep = (next: number) => {
    setStep(next);
    setCurrentStep(user.id, recipe.id, next).catch((e) => console.error(e));
  };
  const finish = async () => {
    setDone(true);
    try {
      await setCompletedDb(user.id, recipe.id, true);
    } catch (e) {
      console.error(e);
      setDone(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
        </Link>

        <div className="flex items-start gap-4 mb-8">
          <div className="text-6xl">{recipe.emoji}</div>
          <div>
            <p className="text-sm font-medium text-primary">{recipe.theme}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{recipe.title}</h1>
            <p className="text-muted-foreground mt-2">{recipe.time} • {recipe.difficulty}</p>
          </div>
        </div>

        {/* AR Viewer */}
        <div
          className="relative rounded-3xl p-8 md:p-12 mb-6 text-foreground border border-border overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 text-xs font-semibold backdrop-blur">
                <Sparkles className="h-3 w-3" /> AR Viewer · Step {step + 1} of {total}
              </span>
              <span className="text-xs font-semibold bg-background/70 px-3 py-1 rounded-full backdrop-blur">{pct}%</span>
            </div>

            <div className="h-1.5 w-full bg-background/40 rounded-full overflow-hidden mb-8">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gradient-warm)" }} />
            </div>

            <div className="bg-background/85 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)]">
              <h2 className="text-2xl font-bold">{current.title}</h2>
              <p className="text-muted-foreground mt-2">{current.detail}</p>
              <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-accent/40">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">Did you know?</p>
                  <p className="text-sm mt-1">{current.learn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" disabled={step === 0} onClick={() => goStep(step - 1)} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {step < total - 1 ? (
            <Button onClick={() => goStep(step + 1)} className="rounded-full text-primary-foreground border-0" style={{ background: "var(--gradient-warm)" }}>
              Next step <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={finish} className="rounded-full text-primary-foreground border-0" style={{ background: "var(--gradient-warm)" }}>
              {done ? <><Check className="h-4 w-4 mr-1" /> Completed!</> : "Mark recipe complete"}
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-3">Ingredients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {recipe.ingredients.map((i: string) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{i}</li>)}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-3">You'll learn</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.topics.map((t: string) => (
                <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
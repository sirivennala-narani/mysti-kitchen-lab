import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.png";
import { Sparkles, Box, ScanLine, Brain, Rocket, ShieldCheck, Star, Check, Atom, Calculator, FlaskConical } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MystiChef — AR Cooking Adventures for Curious Kids" },
      { name: "description", content: "Mystery ingredient kits + AR-guided recipes that turn your kitchen into a STEM playground for kids ages 6–14." },
      { property: "og:title", content: "MystiChef — Cook the unknown. Learn by doing." },
      { property: "og:description", content: "AR-guided STEM cooking kits for curious kids." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Benefits />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="h-3 w-3" /> AR-powered STEM cooking
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Cook the unknown.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-warm)" }}>
              Learn by doing.
            </span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            MystiChef turns every recipe into a STEM adventure. Mystery ingredient kits paired with AR-guided steps make math, science, and curiosity deliciously fun for kids 6–14.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full text-primary-foreground border-0 shadow-[var(--shadow-soft)] hover:opacity-90" style={{ background: "var(--gradient-warm)" }}>
              <Link to="/auth" search={{ mode: "signup" }}>Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#how">How it works</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["🧑‍🍳","👩‍🔬","🧒","👧"].map((e,i)=>(
                <div key={i} className="h-8 w-8 rounded-full bg-card border-2 border-background flex items-center justify-center text-sm">{e}</div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_,i)=>(<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}
              <span className="ml-1 font-semibold text-foreground">4.9</span>
              <span>· loved by 12k+ families</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] blur-3xl opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-soft)] bg-card">
            <img src={heroImg} alt="Child wearing AR glasses learning to cook with floating ingredients" className="w-full h-auto" />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl p-4 shadow-[var(--shadow-card)] hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Step 3</p>
                <p className="text-sm font-bold">Mix ½ + ¼ = ¾ cup</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-[var(--shadow-card)] hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/40 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Science</p>
                <p className="text-sm font-bold">Chemistry unlocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Box, title: "Get your box", desc: "A new themed mystery kit arrives every week with surprise ingredients." },
    { icon: ScanLine, title: "Scan & cook", desc: "Point your device — AR overlays guide every step with magic." },
    { icon: Brain, title: "Learn STEM", desc: "Discover math, chemistry, and physics hidden in every bite." },
  ];
  return (
    <section id="how" className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">How it works</p>
        <h2 className="text-3xl md:text-5xl font-bold mt-2">From box to brilliance in 3 steps</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="relative bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-card)]">
            <div className="absolute -top-4 left-8 text-xs font-bold px-3 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
              Step {i + 1}
            </div>
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "var(--gradient-hero)" }}>
              <s.icon className="h-7 w-7 text-foreground" />
            </div>
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="text-muted-foreground mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Sparkles, title: "Mystery Recipe Explorer", desc: "Weekly themed mystery kits with surprise ingredients." },
    { icon: ScanLine, title: "AR Recipe Viewer", desc: "Step-by-step AR overlays with fractions, temps & science facts." },
    { icon: Brain, title: "Learning Tracker", desc: "Track completed recipes and STEM topics mastered." },
    { icon: ShieldCheck, title: "Kid-safe by design", desc: "Built for kids 6–14 with parent-friendly safety guidance." },
    { icon: Atom, title: "Real STEM curriculum", desc: "Mapped to math, chemistry & physics fundamentals." },
    { icon: Rocket, title: "Built for families", desc: "Cook together, learn together, celebrate every win." },
  ];
  return (
    <section id="features" className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Features</p>
        <h2 className="text-3xl md:text-5xl font-bold mt-2">Everything kids need to fall in love with learning</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((f) => (
          <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-card)] transition">
            <div className="h-11 w-11 rounded-xl bg-accent/30 flex items-center justify-center mb-4">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    "Builds confidence in math through real-world fractions",
    "Sparks curiosity with hands-on chemistry experiments",
    "Improves focus with structured step-by-step tasks",
    "Strengthens family bonds through shared cooking time",
    "Develops practical life skills early",
    "Encourages creativity and problem-solving",
  ];
  return (
    <section className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="rounded-[2rem] border border-border p-8 md:p-14 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Learning benefits</p>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Where the kitchen becomes a classroom</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Every recipe is intentionally designed by educators to teach a STEM concept. Kids don't just cook — they explore, hypothesize, and discover.
            </p>
          </div>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 bg-card/90 backdrop-blur border border-border rounded-xl p-4">
                <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Free", price: "$0", desc: "Perfect to taste-test the magic.", features: ["1 mystery recipe / month", "Basic AR viewer", "Progress tracking"], cta: "Start free", featured: false },
    { name: "Pro", price: "$19", desc: "For growing curious chefs.", features: ["Weekly mystery kits", "Full AR experience", "All STEM topics", "Family progress dashboard"], cta: "Go Pro", featured: true },
    { name: "Premium", price: "$39", desc: "The full curriculum, delivered.", features: ["Everything in Pro", "Live cooking classes", "Premium ingredient kits", "Personal learning coach"], cta: "Get Premium", featured: false },
  ];
  return (
    <section id="pricing" className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Pricing</p>
        <h2 className="text-3xl md:text-5xl font-bold mt-2">Pick a plan, start cooking</h2>
        <p className="text-muted-foreground mt-3">Cancel anytime. Family-friendly pricing.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-8 border ${p.featured ? "border-transparent shadow-[var(--shadow-soft)]" : "border-border bg-card shadow-[var(--shadow-card)]"}`}
            style={p.featured ? { background: "var(--gradient-warm)", color: "var(--primary-foreground)" } : undefined}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-background text-primary border border-border">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{p.price}</span>
              <span className={`text-sm ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>/mo</span>
            </div>
            <p className={`text-sm mt-2 ${p.featured ? "opacity-90" : "text-muted-foreground"}`}>{p.desc}</p>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.featured ? "" : "text-primary"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`w-full mt-8 rounded-full border-0 ${p.featured ? "bg-background text-foreground hover:bg-background/90" : "text-primary-foreground"}`}
              style={p.featured ? undefined : { background: "var(--gradient-warm)" }}
            >
              <Link to="/auth" search={{ mode: "signup" }}>{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pb-20 md:pb-28">
      <div className="rounded-[2rem] p-10 md:p-16 text-center text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-warm)" }}>
        <h2 className="text-3xl md:text-5xl font-bold">Ready to cook the unknown?</h2>
        <p className="mt-4 opacity-90 max-w-xl mx-auto">Join thousands of families turning dinner into a STEM adventure.</p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90">
            <Link to="/auth" search={{ mode: "signup" }}>Sign up free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/auth" search={{ mode: "login" }}>Already a member?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MystiChef. Cook the unknown.</p>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </div>
      </div>
    </footer>
  );
}

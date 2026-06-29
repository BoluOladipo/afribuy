import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ShieldCheck, Truck, CreditCard, Sparkles,
  Headphones, RefreshCcw, Globe2, Star, Quote, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afribuy — Shop authentic African products online" },
      { name: "description", content: "Afribuy is your trusted African marketplace. Shop fashion, beauty, home and more from verified sellers. Secure Flutterwave payments, real-time order tracking, doorstep delivery." },
      { property: "og:title", content: "Afribuy — Shop authentic African products online" },
      { property: "og:description", content: "Shop authentic African products with secure payments and doorstep delivery." },
    ],
  }),
  component: Home,
});

const categories = [
  { name: "Fashion", emoji: "👗", tint: "from-emerald-100 to-emerald-50" },
  { name: "Beauty", emoji: "💄", tint: "from-rose-100 to-rose-50" },
  { name: "Home", emoji: "🏺", tint: "from-amber-100 to-amber-50" },
  { name: "Food", emoji: "🌽", tint: "from-yellow-100 to-yellow-50" },
  { name: "Art", emoji: "🎨", tint: "from-violet-100 to-violet-50" },
  { name: "Tech", emoji: "📱", tint: "from-sky-100 to-sky-50" },
];

const testimonials = [
  { name: "Chiamaka O.", city: "Lagos", text: "My order arrived in 3 days and the quality was beyond what I expected. Afribuy is now my go-to.", rating: 5 },
  { name: "Kwame A.", city: "Accra", text: "Checkout was painless and I loved getting an email the moment my payment went through.", rating: 5 },
  { name: "Amina S.", city: "Nairobi", text: "Finally a marketplace that feels made for us. The product range keeps getting better.", rating: 5 },
];

function Home() {
  const { user } = useAuth();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/30" />
        <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Trusted by thousands across Africa
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Authentic African <span className="text-primary">finds</span>,<br />
              delivered to your door.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              From hand-woven fabrics to everyday essentials — Afribuy connects you with verified sellers across the continent. Pay safely with Flutterwave and track every order in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/shop">Start shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/signup">Create free account</Link>
                </Button>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Buyer protection</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Pan-African delivery</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> 4.9 / 5 rating</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/40 blur-2xl" />
            <img
              src={hero}
              alt="Happy shopper holding colourful Afribuy shopping bags"
              className="aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
              width={1024}
              height={1024}
            />
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border bg-background/95 p-3 pr-5 shadow-xl backdrop-blur sm:flex">
              <img src={logo} alt="" className="h-10 w-10" />
              <div>
                <div className="text-xs text-muted-foreground">Order #AFB-2419</div>
                <div className="text-sm font-semibold">Out for delivery 🚚</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by category</h2>
            <p className="mt-2 text-muted-foreground">Discover something new every visit.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/shop">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/shop"
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${c.tint} p-5 transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-3 font-semibold">{c.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">Shop now →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Secure checkout", desc: "Encrypted Flutterwave payments — cards, transfer or USSD." },
            { icon: Truck, title: "Live tracking", desc: "Follow your order from confirmation to your front door." },
            { icon: RefreshCcw, title: "Easy returns", desc: "Not what you expected? 7-day no-questions-asked returns." },
            { icon: Headphones, title: "Real human support", desc: "WhatsApp & email support that actually answers." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">How Afribuy works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps between you and your next favourite thing.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { n: "01", t: "Browse & add to cart", d: "Search thousands of curated products from verified African sellers." },
            { n: "02", t: "Pay securely", d: "Checkout with Flutterwave using card, bank transfer or USSD — your details stay safe." },
            { n: "03", t: "Track to your door", d: "Get email updates and follow your order status from your Orders page." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border bg-card p-7">
              <div className="text-5xl font-bold text-primary/20">{s.n}</div>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y bg-gradient-to-br from-primary/5 to-accent/20">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Loved across the continent</h2>
            <p className="mt-3 text-muted-foreground">Real words from real shoppers.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-card p-6 shadow-sm">
                <Quote className="h-6 w-6 text-primary/40" />
                <p className="mt-3 text-sm leading-relaxed">{t.text}</p>
                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.city}</div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto grid grid-cols-2 gap-6 px-4 py-16 md:grid-cols-4">
        {[
          { k: "20k+", v: "Happy shoppers" },
          { k: "500+", v: "Verified sellers" },
          { k: "12", v: "African countries" },
          { k: "4.9★", v: "Average rating" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border bg-card p-6 text-center">
            <div className="text-3xl font-bold text-primary">{s.k}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </section>

      {/* NEWSLETTER / CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-emerald-700 p-10 text-primary-foreground md:p-16">
          <Globe2 className="absolute -right-10 -top-10 h-64 w-64 text-white/10" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Stay in the loop
              </h2>
              <p className="mt-3 max-w-md text-primary-foreground/80">
                Get early access to new drops, seller stories and members-only deals — straight to your inbox.
              </p>
            </div>
            <form
              className="flex w-full max-w-md gap-2 self-end md:justify-self-end"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="you@example.com" className="bg-background pl-9 text-foreground" />
              </div>
              <Button variant="secondary" type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer is rendered globally via SiteFooter */}
    </div>
  );
}

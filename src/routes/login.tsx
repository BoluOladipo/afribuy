import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ShoppingBag, Mail, Lock } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Afribuy" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate({ to: "/shop" });
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="Afribuy" className="h-10 w-10 rounded-md bg-white/10 p-1" />
            <span className="text-2xl font-extrabold tracking-tight">Afribuy</span>
          </Link>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">Welcome back to <br /> the marketplace of Africa.</h2>
          <p className="text-emerald-50/90 max-w-md">Shop authentic, hand-picked goods from creators and merchants across the continent — delivered to your doorstep.</p>
          <div className="flex items-center gap-6 text-sm">
            <div><div className="text-3xl font-extrabold">20k+</div><div className="text-emerald-100/80">Happy shoppers</div></div>
            <div className="h-10 w-px bg-white/20" />
            <div><div className="text-3xl font-extrabold">500+</div><div className="text-emerald-100/80">Verified sellers</div></div>
            <div className="h-10 w-px bg-white/20" />
            <div><div className="text-3xl font-extrabold">4.9★</div><div className="text-emerald-100/80">Avg rating</div></div>
          </div>
        </div>
        <div className="relative text-xs text-emerald-100/70">© {new Date().getFullYear()} Afribuy. Built by BoluOladipoCodes.</div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <img src={logo} alt="Afribuy" className="h-9 w-9" />
            <span className="text-xl font-extrabold">Afribuy</span>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-xl shadow-emerald-900/5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShoppingBag className="h-3.5 w-3.5" /> Member sign in
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Welcome back 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">Login to continue shopping.</p>

            <form className="mt-7 space-y-5" onSubmit={submit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/reset-password" className="text-xs font-medium text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10 h-11" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to Afribuy?{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline">Create a free account</Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateOTP, sendOtpEmail } from "@/lib/emailjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Check, User, Mail, Lock, Eye, EyeOff, ShoppingBag, ShieldCheck, Truck, BadgePercent } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Afribuy" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const otp = generateOTP();
      await sendOtpEmail({ to_email: email, user_name: name, otp });
      setOtpSent(otp);
      setStep("otp");
      toast.success("OTP sent to your email");
    } catch {
      toast.error("Could not send OTP. Check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== otpSent) return toast.error("Invalid OTP");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), { name, email, createdAt: Date.now() });
      await signOut(auth);
      setStep("success");
    } catch (err: any) {
      toast.error(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="Afribuy" className="h-10 w-10 rounded-md bg-white/10 p-1" />
            <span className="text-2xl font-extrabold tracking-tight">Afribuy</span>
          </Link>
        </div>
        <div className="relative space-y-8">
          <h2 className="text-4xl font-extrabold leading-tight">Join thousands shopping <br /> authentic African brands.</h2>
          <ul className="space-y-3 text-emerald-50/90">
            <li className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 mt-0.5 text-emerald-200" /> Secure checkout with Flutterwave</li>
            <li className="flex items-start gap-3"><Truck className="h-5 w-5 mt-0.5 text-emerald-200" /> Live order tracking, country-wide</li>
            <li className="flex items-start gap-3"><BadgePercent className="h-5 w-5 mt-0.5 text-emerald-200" /> Member-only deals every week</li>
          </ul>
        </div>
        <div className="relative text-xs text-emerald-100/70">© {new Date().getFullYear()} Afribuy. Built by BoluOladipoCodes.</div>
      </div>

      {/* Form / OTP / success */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <img src={logo} alt="Afribuy" className="h-9 w-9" />
            <span className="text-xl font-extrabold">Afribuy</span>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-xl shadow-emerald-900/5">
            {step === "success" ? (
              <div className="text-center py-4">
                <div className="mx-auto grid h-44 w-44 place-items-center rounded-[2rem] bg-gradient-to-br from-emerald-50 to-emerald-100 ring-8 ring-emerald-50/60 shadow-inner">
                  <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/40 animate-bounce">
                    <Check className="h-16 w-16 text-white" strokeWidth={3.5} />
                  </div>
                </div>
                <h1 className="mt-8 text-3xl font-extrabold text-emerald-700">Account verified!</h1>
                <p className="mt-3 text-base text-muted-foreground">Please return to the login page to sign in.</p>
                <Button asChild size="lg" className="mt-7 w-full h-11 text-base font-semibold">
                  <Link to="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShoppingBag className="h-3.5 w-3.5" /> Create your account
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                  {step === "form" ? "Join Afribuy 🎉" : "Verify your email"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step === "form" ? "We'll send a 6-digit code to verify your email." : `Enter the 6-digit code we sent to ${email}.`}
                </p>

                {step === "form" ? (
                  <form className="mt-7 space-y-5" onSubmit={sendOtp}>
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="pl-9 h-11" placeholder="Jane Doe" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type={showPw ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10 h-11" placeholder="At least 6 characters" />
                        <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" size="lg" className="w-full h-11 text-base font-semibold" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send verification code
                    </Button>
                  </form>
                ) : (
                  <form className="mt-7 space-y-5" onSubmit={verifyAndCreate}>
                    <div>
                      <Label htmlFor="otp">6-digit code</Label>
                      <Input
                        id="otp"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                        className="mt-1.5 text-center text-2xl font-bold tracking-[0.6em] h-14"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-11 text-base font-semibold" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & create account
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("form")}>Back</Button>
                  </form>
                )}

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { generateOTP, sendOtpEmail } from "@/lib/emailjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Afribuy" }] }),
  component: Reset,
});

function Reset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otp = generateOTP();
      await sendOtpEmail({ to_email: email, user_name: email.split("@")[0], otp });
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Check your inbox for the reset instructions.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll email you a verification code and a secure reset link.
        </p>
        {sent ? (
          <div className="mt-6 rounded-lg bg-accent/50 p-4 text-sm">
            Email sent to <b>{email}</b>. Open the reset link to set a new password.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset email
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

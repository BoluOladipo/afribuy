import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { payWithFlutterwave } from "@/lib/flutterwave";
import { sendOrderEmail } from "@/lib/emailjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Afribuy" }] }),
  component: () => (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  ),
});

function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4"><Link to="/shop">Go to shop</Link></Button>
      </div>
    );
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const tx_ref = `AFB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await payWithFlutterwave({
        amount: total,
        email: user.email!,
        name,
        phone,
        tx_ref,
        onSuccess: async (response) => {
          try {
            const orderRef = await addDoc(collection(db, "orders"), {
              userId: user.uid,
              userEmail: user.email,
              userName: name,
              phone,
              address,
              products: items,
              total,
              paymentStatus: response.status === "successful" || response.status === "completed" ? "paid" : "pending",
              paymentRef: response.tx_ref ?? tx_ref,
              transactionId: response.transaction_id ?? null,
              status: "processing",
              createdAt: serverTimestamp(),
              timestamp: Date.now(),
            });
            try {
              await sendOrderEmail({
                to_email: user.email!,
                user_name: name,
                order_id: orderRef.id,
                amount: total,
              });
            } catch { /* email is best-effort */ }
            clear();
            toast.success("Payment successful!");
            navigate({ to: "/orders" });
          } catch (err) {
            toast.error("Payment received but order save failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        onClose: () => setLoading(false),
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Payment could not be started");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <form onSubmit={pay} className="lg:col-span-2 space-y-4 rounded-xl border bg-card p-6">
          <h2 className="font-semibold">Shipping details</h2>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="address">Delivery address</Label>
            <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay ₦{total.toLocaleString()} with Flutterwave
          </Button>
        </form>

        <div>
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-2">
                  <span className="text-muted-foreground line-clamp-1">{i.name} × {i.quantity}</span>
                  <span>₦{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span><span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

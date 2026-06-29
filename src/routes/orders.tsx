import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Afribuy" }] }),
  component: () => (
    <RequireAuth>
      <Orders />
    </RequireAuth>
  ),
});

type Tab = "ongoing" | "closed";

const ONGOING_STATUSES = ["processing", "shipped", "out_for_delivery"];
const CLOSED_STATUSES = ["delivered", "cancelled", "canceled", "returned"];

function Orders() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("ongoing");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      } catch {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        return snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
      }
    },
    enabled: !!user,
  });

  const { ongoing, closed } = useMemo(() => {
    const o: any[] = [];
    const c: any[] = [];
    (data ?? []).forEach((order: any) => {
      const status = String(order.status ?? "processing").toLowerCase().replace(/\s+/g, "_");
      if (CLOSED_STATUSES.includes(status)) c.push(order);
      else o.push(order);
    });
    return { ongoing: o, closed: c };
  }, [data]);

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  const list = tab === "ongoing" ? ongoing : closed;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="mt-6 flex gap-2 border-b">
        <TabButton active={tab === "ongoing"} onClick={() => setTab("ongoing")}>
          Ongoing / Delivered
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {ongoing.length}
          </span>
        </TabButton>
        <TabButton active={tab === "closed"} onClick={() => setTab("closed")}>
          Cancelled / Returned
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {closed.length}
          </span>
        </TabButton>
      </div>

      {(!data || data.length === 0) && (
        <div className="py-20 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">Your purchases will appear here.</p>
          <Button asChild className="mt-6">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      )}

      {data && data.length > 0 && list.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          Nothing here for now.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {list.map((o: any) => (
          <OrderCard key={o.id} o={o} />
        ))}
      </div>
    </div>
  );
}

function TabButton({
  active, children, onClick,
}: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative -mb-px px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "border-b-2 border-primary text-foreground"
          : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function OrderCard({ o }: { o: any }) {
  const status = String(o.status ?? "processing").toLowerCase().replace(/\s+/g, "_");
  const isClosed = CLOSED_STATUSES.includes(status);

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">Order ID</div>
          <div className="font-mono text-sm">{o.id}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {o.timestamp ? new Date(o.timestamp).toLocaleString() : ""}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              o.paymentStatus === "paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            Payment: {o.paymentStatus ?? "pending"}
          </span>
          <StatusBadge status={status} />
        </div>
      </div>

      {!isClosed && <OrderTracker status={status} />}
      {isClosed && (
        <div className={`mt-4 rounded-lg border p-3 text-sm ${
          status === "delivered"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-rose-200 bg-rose-50 text-rose-800"
        }`}>
          {status === "delivered" && "Delivered. Thank you for shopping with Afribuy!"}
          {(status === "cancelled" || status === "canceled") && "This order was cancelled."}
          {status === "returned" && "This order was returned and refunded."}
        </div>
      )}

      <div className="mt-4 divide-y">
        {(o.products ?? []).map((p: any) => (
          <div key={p.id} className="flex items-center gap-3 py-2 text-sm">
            <div className="h-12 w-12 flex-none overflow-hidden rounded bg-muted">
              {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">{p.name} × {p.quantity}</div>
            <div>₦{(p.price * p.quantity).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between border-t pt-3 font-bold">
        <span>Total</span>
        <span>₦{Number(o.total ?? 0).toLocaleString()}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    processing: "bg-amber-100 text-amber-700",
    shipped: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
    canceled: "bg-rose-100 text-rose-700",
    returned: "bg-rose-100 text-rose-700",
  };
  const label = status.replace(/_/g, " ");
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-accent"}`}>
      {label}
    </span>
  );
}

const STEPS = ["processing", "shipped", "out_for_delivery", "delivered"] as const;
const STEP_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

function OrderTracker({ status }: { status: string }) {
  const currentIdx = Math.max(0, STEPS.indexOf(status as any));
  return (
    <div className="mt-5 rounded-lg border bg-muted/30 p-4">
      <div className="text-xs font-semibold text-muted-foreground">Order tracking</div>
      <div className="mt-3 flex items-center">
        {STEPS.map((s, i) => {
          const done = i <= currentIdx;
          return (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                    done ? "bg-primary text-primary-foreground" : "bg-background border text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <div className={`mt-1.5 text-[10px] font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                  {STEP_LABELS[s]}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 mb-5 h-0.5 flex-1 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

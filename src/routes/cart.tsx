import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Package, ShoppingBag } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Afribuy" }] }),
  component: () => (
    <RequireAuth>
      <CartPage />
    </RequireAuth>
  ),
});

function CartPage() {
  const { items, remove, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
        <Button asChild className="mt-6"><Link to="/shop">Browse shop</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <div className="h-20 w-20 flex-none overflow-hidden rounded-lg bg-muted">
                {i.image ? <img src={i.image} alt={i.name} className="h-full w-full object-cover" /> : <Package className="h-full w-full p-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-primary font-bold mt-1">₦{i.price.toLocaleString()}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-md border text-sm">
                    <button className="px-2 py-1 hover:bg-accent" onClick={() => updateQty(i.id, i.quantity - 1)}>−</button>
                    <span className="w-8 text-center">{i.quantity}</span>
                    <button className="px-2 py-1 hover:bg-accent" onClick={() => updateQty(i.id, i.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-sm text-destructive inline-flex items-center hover:underline">
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">₦{(i.price * i.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 sticky top-20">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>At checkout</span></div>
            </div>
            <div className="mt-4 border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span><span>₦{total.toLocaleString()}</span>
            </div>
            <Button asChild className="w-full mt-6" size="lg">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

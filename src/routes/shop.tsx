import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProducts, type Product } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Loader2, Search, ShoppingCart, Package, Minus, Plus, Star } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop — Afribuy" }] }),
  component: Shop,
});

function Shop() {
  const { data, isLoading, error } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const s = new Set<string>();
    data?.forEach((p) => s.add(p.category));
    return ["all", ...Array.from(s)];
  }, [data]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [data, search, category]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground mt-1">Browse our latest products</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {categories.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm">
            Failed to load products. Please refresh.
          </div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { items, add, updateQty, remove } = useCart();
  const inCart = items.find((i) => i.id === p.id);
  const qty = inCart?.quantity ?? 0;

  const handleAdd = () => {
    add({ id: p.id, name: p.name, price: p.price, image: p.image });
    toast.success(`${p.name} added to cart`);
  };

  const inc = () => updateQty(p.id, qty + 1);
  const dec = () => {
    if (qty <= 1) remove(p.id);
    else updateQty(p.id, qty - 1);
  };

  return (
    <div className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-square overflow-hidden bg-muted">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow">
          {p.category}
        </span>
        {p.stock <= 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-destructive px-2 py-0.5 text-[10px] font-semibold uppercase text-destructive-foreground shadow">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="block text-sm font-semibold leading-tight line-clamp-2 hover:text-primary"
        >
          {p.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">₦{p.price.toLocaleString()}</span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="ml-1">(4.9)</span>
        </div>

        <div className="mt-3 flex-1" />

        {qty === 0 ? (
          <Button size="sm" className="w-full" onClick={handleAdd} disabled={p.stock <= 0}>
            <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to cart
          </Button>
        ) : (
          <div className="flex items-center justify-between rounded-md border bg-background">
            <button
              onClick={dec}
              className="grid h-9 w-9 place-items-center text-foreground hover:bg-accent rounded-l-md"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold">
              {qty} <span className="text-muted-foreground font-normal">in cart</span>
            </span>
            <button
              onClick={inc}
              className="grid h-9 w-9 place-items-center text-primary-foreground bg-primary hover:bg-primary/90 rounded-r-md"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

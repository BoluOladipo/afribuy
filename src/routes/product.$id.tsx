import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, getRelatedProducts, getRecentlyViewed, pushRecentlyViewed, getReviews, type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Package, ShoppingCart, Star, Truck, ShieldCheck, RotateCcw, Heart, Share2, Check, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product — Afribuy" }] }),
  component: ProductPage,
});

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const { data: p, isLoading } = useQuery({ queryKey: ["product", id], queryFn: () => fetchProduct(id) });
  const { add, items, updateQty, remove } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"description" | "reviews">("description");

  useEffect(() => {
    if (p) pushRecentlyViewed(p.id);
    setActiveImg(0);
  }, [p?.id]);

  const reviews = useMemo(() => (p ? getReviews(p.id) : []), [p?.id]);
  const related = useMemo(() => (p ? getRelatedProducts(p, 6) : []), [p?.id]);
  const recent = useMemo(() => (p ? getRecentlyViewed(p.id, 6) : []), [p?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!p) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild className="mt-4"><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const inCart = items.find((i) => i.id === p.id);
  const rating = p.rating ?? 4.7;
  const reviewCount = p.reviewCount ?? reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((s) => ({ s, c: reviews.filter((r) => r.rating === s).length }));

  return (
    <div className="bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{p.category}</span>
          <span>/</span>
          <span className="truncate max-w-[40ch]">{p.name}</span>
        </nav>

        <Link to="/shop" className="mt-3 inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to shop
        </Link>

        {/* Top section: gallery + summary + delivery */}
        <div className="mt-4 grid lg:grid-cols-12 gap-4">
          {/* Gallery */}
          <div className="lg:col-span-5 rounded-2xl border bg-card p-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-muted">
              {gallery[activeImg] ? (
                <img src={gallery[activeImg]} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground"><Package className="h-16 w-16" /></div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                      activeImg === i ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img src={src} alt={`${p.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><Heart className="mr-1.5 h-4 w-4" /> Save</Button>
              <Button variant="outline" size="sm" className="flex-1"><Share2 className="mr-1.5 h-4 w-4" /> Share</Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 rounded-2xl border bg-card p-6">
            {p.brand && <div className="text-xs uppercase tracking-wide text-muted-foreground">Brand: <span className="text-primary font-semibold">{p.brand}</span></div>}
            <h1 className="mt-1 text-2xl font-bold leading-snug">{p.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <StarRow value={rating} />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <button onClick={() => setTab("reviews")} className="text-muted-foreground hover:text-primary">({reviewCount} verified ratings)</button>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="text-3xl font-extrabold">₦{p.price.toLocaleString()}</div>
              <div className="mt-1 text-xs text-emerald-600 font-medium">+ Free delivery on orders over ₦30,000</div>
              <div className="mt-3 text-sm">
                {p.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                    <Check className="h-4 w-4" /> In stock — {p.stock} units available
                  </span>
                ) : (
                  <span className="text-destructive font-medium">Out of stock</span>
                )}
              </div>
            </div>

            <div className="mt-5 border-t pt-5">
              <div className="text-sm font-semibold mb-2">Quantity</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border bg-background">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-accent"><Minus className="h-4 w-4" /></button>
                  <span className="w-12 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center hover:bg-accent"><Plus className="h-4 w-4" /></button>
                </div>
                {inCart && <span className="text-xs text-muted-foreground">{inCart.quantity} already in cart</span>}
              </div>
              <Button
                size="lg"
                className="mt-4 w-full h-12 text-base font-semibold"
                disabled={p.stock <= 0}
                onClick={() => {
                  add({ id: p.id, name: p.name, price: p.price, image: p.image }, qty);
                  toast.success(`Added ${qty} × ${p.name}`);
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to cart
              </Button>
              {inCart && (
                <div className="mt-2 flex items-center justify-between rounded-md border bg-background">
                  <button onClick={() => { if (inCart.quantity <= 1) remove(p.id); else updateQty(p.id, inCart.quantity - 1); }} className="grid h-9 w-9 place-items-center hover:bg-accent"><Minus className="h-4 w-4" /></button>
                  <span className="text-sm font-semibold">{inCart.quantity} in cart</span>
                  <button onClick={() => updateQty(p.id, inCart.quantity + 1)} className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90"><Plus className="h-4 w-4" /></button>
                </div>
              )}
            </div>
          </div>

          {/* Delivery / promises */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border bg-card p-5">
              <div className="text-sm font-semibold">Delivery & Returns</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex gap-3"><Truck className="h-5 w-5 text-primary shrink-0" /><span><b>Door delivery</b><br /><span className="text-muted-foreground text-xs">2-5 business days nationwide</span></span></li>
                <li className="flex gap-3"><RotateCcw className="h-5 w-5 text-primary shrink-0" /><span><b>Easy returns</b><br /><span className="text-muted-foreground text-xs">Free returns within 7 days</span></span></li>
                <li className="flex gap-3"><ShieldCheck className="h-5 w-5 text-primary shrink-0" /><span><b>Buyer protection</b><br /><span className="text-muted-foreground text-xs">Money-back guarantee</span></span></li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-emerald-50 p-5">
              <div className="text-sm font-bold text-emerald-800">Seller info</div>
              <div className="mt-2 text-sm text-emerald-900/80">{p.brand ?? "Afribuy Verified Seller"}</div>
              <div className="mt-1 text-xs text-emerald-700">Verified seller · 98% positive feedback</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 rounded-2xl border bg-card overflow-hidden">
          <div className="flex border-b">
            <button onClick={() => setTab("description")} className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${tab === "description" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Description</button>
            <button onClick={() => setTab("reviews")} className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${tab === "reviews" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Reviews ({reviewCount})</button>
          </div>

          {tab === "description" ? (
            <div className="p-6 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2">About this item</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <h3 className="mt-5 text-base font-semibold mb-2">What's in the box</h3>
                <p className="text-sm text-muted-foreground">1 × {p.name}</p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Specifications</h3>
                <dl className="text-sm divide-y">
                  <div className="flex justify-between py-2"><dt className="text-muted-foreground">Category</dt><dd className="font-medium">{p.category}</dd></div>
                  {p.brand && <div className="flex justify-between py-2"><dt className="text-muted-foreground">Brand</dt><dd className="font-medium">{p.brand}</dd></div>}
                  <div className="flex justify-between py-2"><dt className="text-muted-foreground">Stock</dt><dd className="font-medium">{p.stock} units</dd></div>
                  <div className="flex justify-between py-2"><dt className="text-muted-foreground">SKU</dt><dd className="font-mono text-xs">{p.id.toUpperCase()}</dd></div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="p-6 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="text-center">
                  <div className="text-5xl font-extrabold">{rating.toFixed(1)}</div>
                  <div className="mt-2 flex justify-center"><StarRow value={rating} size={18} /></div>
                  <div className="mt-1 text-xs text-muted-foreground">{reviewCount} verified ratings</div>
                </div>
                <div className="mt-5 space-y-1.5">
                  {breakdown.map(({ s, c }) => {
                    const pct = reviews.length ? Math.round((c / reviews.length) * 100) : 0;
                    return (
                      <div key={s} className="flex items-center gap-2 text-xs">
                        <span className="w-3">{s}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{c}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-2 space-y-5">
                <h3 className="text-base font-semibold">Customer reviews</h3>
                {reviews.map((r) => (
                  <div key={r.id} className="border-b pb-5 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {r.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{r.author}</div>
                          <div className="text-xs text-muted-foreground">{r.date}{r.verified && <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-600"><Check className="h-3 w-3" />Verified purchase</span>}</div>
                        </div>
                      </div>
                      <StarRow value={r.rating} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <Section title="You may also like">
            <CardRow items={related} />
          </Section>
        )}

        {/* Recently viewed */}
        {recent.length > 0 && (
          <Section title="Recently viewed">
            <CardRow items={recent} />
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link to="/shop" className="text-sm text-primary hover:underline">View all</Link>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CardRow({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((p) => (
        <Link
          key={p.id}
          to="/product/$id"
          params={{ id: p.id }}
          className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            {p.image ? (
              <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground"><Package className="h-8 w-8" /></div>
            )}
          </div>
          <div className="p-3">
            <div className="text-xs font-semibold line-clamp-2 group-hover:text-primary">{p.name}</div>
            <div className="mt-1 text-sm font-bold">₦{p.price.toLocaleString()}</div>
            <div className="mt-1 flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">{(p.rating ?? 4.7).toFixed(1)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

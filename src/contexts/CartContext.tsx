import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const LS_KEY = "afribuy_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load
  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, "carts", user.uid));
          if (snap.exists()) {
            setItems((snap.data().items as CartItem[]) || []);
          } else {
            const ls = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
            setItems(ls ? JSON.parse(ls) : []);
          }
        } catch {
          /* ignore */
        }
      } else if (typeof window !== "undefined") {
        const ls = localStorage.getItem(LS_KEY);
        setItems(ls ? JSON.parse(ls) : []);
      }
      setHydrated(true);
    })();
  }, [user]);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(items));
    if (user) {
      setDoc(doc(db, "carts", user.uid), { items, updatedAt: Date.now() }).catch(() => {});
    }
  }, [items, user, hydrated]);

  const add: CartCtx["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p));
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, updateQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

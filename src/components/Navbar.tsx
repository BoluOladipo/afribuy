import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, User, Package, Store, Home, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, STORE_NAME } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Navbar() {
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Store },
    { to: "/cart", label: "Cart", icon: ShoppingCart },
    { to: "/orders", label: "Orders", icon: Package },
    { to: "/profile", label: "Profile", icon: User },
  ] as const;

  const handleLogout = async () => {
    await signOut(auth);
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Afribuy logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold tracking-tight">
            {STORE_NAME}<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === n.to && "bg-accent text-accent-foreground"
              )}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
              {n.to === "/cart" && count > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <n.icon className="h-4 w-4" />
                {n.label}
                {n.to === "/cart" && count > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </Link>
            ))}
            <div className="mt-2 border-t pt-2">
              {user ? (
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

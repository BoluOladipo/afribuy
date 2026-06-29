import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-9 w-9" />
            <span className="text-lg font-bold">
              Afribuy<span className="text-primary">.</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Authentic African products, delivered with care.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Shop</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">All products</Link></li>
            <li><Link to="/cart" className="hover:text-foreground">My cart</Link></li>
            <li><Link to="/orders" className="hover:text-foreground">Track orders</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Account</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
            <li><Link to="/profile" className="hover:text-foreground">My profile</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Support</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>support@afribuy.com</li>
            <li>Mon – Sat, 9am – 6pm WAT</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Afribuy. All rights reserved.</div>
          <div>
            Built by{" "}
            <a
              href="https://github.com/BoluOladipoCodes"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              BoluOladipoCodes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

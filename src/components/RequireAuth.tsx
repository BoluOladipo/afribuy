import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

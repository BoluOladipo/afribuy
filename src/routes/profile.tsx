import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut, Mail, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Afribuy" }] }),
  component: () => (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  ),
});

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="mt-8 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
            {(user?.displayName ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-semibold">{user?.displayName ?? "Customer"}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Name:</span>
            <span className="ml-auto font-medium">{user?.displayName ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="ml-auto font-medium">{user?.email}</span>
          </div>
        </div>
        <Button
          variant="destructive"
          className="mt-6 w-full"
          onClick={async () => {
            await signOut(auth);
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}

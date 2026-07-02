"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Trash2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSession } from "@/lib/store";
import { deleteSession, listSessions, loadSession } from "@/lib/sessions";
import type { SessionSummary } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SessionsPage() {
  const { user, loading, enabled, signIn } = useAuth();
  const { dispatch } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [sessions, setSessions] = useState<SessionSummary[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listSessions(user.uid)
      .then(setSessions)
      .catch(() => setSessions([]));
  }, [user]);

  if (!enabled) {
    return (
      <div className="py-16 text-center text-muted">
        Saving isn&apos;t set up on this deployment. You can still create teams
        on the home page.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-10 grid gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-foreground/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 flex flex-col items-center text-center gap-4">
        <FolderOpen size={32} className="text-muted" />
        <h1 className="font-display font-bold text-2xl">Your saved sessions</h1>
        <p className="text-muted max-w-sm text-sm">
          Sign in with Google and every session — people, teams, and scores —
          saves automatically so you can pick it up on any device.
        </p>
        <Button variant="primary" onClick={() => signIn().catch(() => {})}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  const open = async (id: string) => {
    const session = await loadSession(user.uid, id);
    if (!session) {
      toast("That session no longer exists");
      return;
    }
    dispatch({ type: "load-session", state: session });
    router.push("/");
  };

  return (
    <div className="py-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-6">My sessions</h1>

      {sessions === null && (
        <div className="grid gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-foreground/5 animate-pulse" />
          ))}
        </div>
      )}

      {sessions?.length === 0 && (
        <p className="text-muted text-sm">
          Nothing saved yet. Create teams on the home page and they&apos;ll
          appear here automatically.
        </p>
      )}

      <ul className="grid gap-3">
        {sessions?.map((session) => (
          <li
            key={session.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <button
              onClick={() => open(session.id)}
              className="flex-1 min-w-0 text-left cursor-pointer group"
            >
              <div className="font-medium truncate group-hover:text-accent transition-colors">
                {session.name}
              </div>
              <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {session.peopleCount}
                </span>
                <span>
                  {session.teamCount} {session.teamCount === 1 ? "team" : "teams"}
                </span>
                <span>{formatDate(session.updatedAt)}</span>
              </div>
            </button>
            <Button variant="secondary" size="sm" onClick={() => open(session.id)}>
              Open
            </Button>
            <Button
              variant="danger"
              size="sm"
              aria-label={`Delete ${session.name}`}
              onClick={async () => {
                await deleteSession(user.uid, session.id);
                setSessions((prev) =>
                  prev ? prev.filter((s) => s.id !== session.id) : prev,
                );
                toast("Session deleted");
              }}
            >
              <Trash2 size={15} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { RotateCcw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSession } from "@/lib/store";
import { PeoplePanel } from "@/components/PeoplePanel";
import { SetupPanel } from "@/components/SetupPanel";
import { TeamBoard } from "@/components/TeamBoard";
import { Button } from "@/components/ui";

export default function Home() {
  const { state, dispatch, hydrated } = useSession();
  const { user, enabled } = useAuth();
  const empty = state.people.length === 0 && state.teams.length === 0;

  if (!hydrated) {
    return (
      <div className="py-10 grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="h-64 rounded-2xl bg-foreground/5 animate-pulse" />
        <div className="h-64 rounded-2xl bg-foreground/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      {empty && (
        <div className="mb-8 mt-2 sm:mt-6 text-center sm:text-left">
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-balance">
            Fair teams in seconds.
          </h1>
          <p className="text-muted mt-2 max-w-xl mx-auto sm:mx-0">
            Type names or drop in a spreadsheet, choose how to split, and let
            TeamGen shuffle. Latecomers slot right in, and you can keep score
            while you play.
          </p>
        </div>
      )}

      {!empty && (
        <div className="flex items-center justify-between gap-3 mb-5">
          <input
            value={state.name}
            onChange={(e) =>
              dispatch({ type: "rename-session", name: e.target.value })
            }
            aria-label="Session name"
            className="font-display font-bold text-xl sm:text-2xl bg-transparent min-w-0 flex-1 focus:outline-none border-b border-transparent focus:border-border"
          />
          <div className="flex items-center gap-2 shrink-0">
            {enabled && !user && (
              <span className="hidden md:inline text-xs text-muted">
                Sign in to save this session
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "new-session" })}
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Start over</span>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] items-start">
        <aside className="grid gap-4 lg:sticky lg:top-20">
          <PeoplePanel />
          <SetupPanel />
        </aside>
        <TeamBoard />
      </div>
    </div>
  );
}

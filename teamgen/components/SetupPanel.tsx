"use client";

import { Minus, Plus, Shuffle } from "lucide-react";
import { teamCountFor } from "@/lib/teams";
import { useSession } from "@/lib/store";
import { Button, Segmented, Switch } from "./ui";

function previewText(peopleCount: number, mode: "teams" | "size", count: number) {
  if (peopleCount < 2) return "Add at least 2 people to get started.";
  const teams = teamCountFor(peopleCount, { mode, count, scoringEnabled: false });
  const base = Math.floor(peopleCount / teams);
  const extra = peopleCount % teams;
  const size = extra === 0 ? `${base}` : `${base}–${base + 1}`;
  return `${peopleCount} people → ${teams} ${teams === 1 ? "team" : "teams"} of ${size}`;
}

export function SetupPanel() {
  const { state, dispatch } = useSession();
  const { mode, count, scoringEnabled } = state.settings;
  const generated = state.generatedAt !== null;
  const min = mode === "teams" ? 2 : 1;

  const setCount = (next: number) =>
    dispatch({
      type: "set-settings",
      settings: { count: Math.min(99, Math.max(min, next)) },
    });

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <h2 className="font-display font-semibold mb-3">Split into</h2>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Segmented
          value={mode}
          onChange={(next) =>
            dispatch({
              type: "set-settings",
              settings: { mode: next, count: next === "teams" ? 2 : 4 },
            })
          }
          options={[
            { value: "teams", label: "Number of teams" },
            { value: "size", label: "Team size" },
          ]}
        />
        <div className="flex items-center rounded-xl border border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCount(count - 1)}
            disabled={count <= min}
            aria-label="Decrease"
          >
            <Minus size={15} />
          </Button>
          <span className="w-8 text-center font-mono text-sm font-semibold">
            {count}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCount(count + 1)}
            disabled={count >= 99}
            aria-label="Increase"
          >
            <Plus size={15} />
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted mb-4">
        {previewText(state.people.length, mode, count)}
      </p>

      <label className="flex items-center justify-between gap-3 mb-5">
        <span className="text-sm">
          Keep score
          <span className="block text-xs text-muted">
            Adds points and a leaderboard to each team
          </span>
        </span>
        <Switch
          checked={scoringEnabled}
          onChange={(next) =>
            dispatch({ type: "set-settings", settings: { scoringEnabled: next } })
          }
          label="Keep score"
        />
      </label>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={state.people.length < 2}
        onClick={() => dispatch({ type: "generate" })}
      >
        <Shuffle size={18} />
        {generated ? "Reshuffle teams" : "Generate teams"}
      </Button>
    </section>
  );
}

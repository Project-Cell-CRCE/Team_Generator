"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Copy,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Minus,
  MoreHorizontal,
  Plus,
  Share2,
  UserX,
} from "lucide-react";
import { downloadCsv, teamsToText } from "@/lib/export";
import { downloadExcel } from "@/lib/exportExcel";
import { downloadPdf } from "@/lib/exportPdf";
import { TEAM_COLORS } from "@/lib/teams";
import { useSession } from "@/lib/store";
import type { Person, Team } from "@/lib/types";
import { useToast } from "./Toast";
import { Button, MenuItem, Popover } from "./ui";

function ScoreControls({ team }: { team: Team }) {
  const { dispatch } = useSession();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => dispatch({ type: "add-score", teamId: team.id, delta: -1 })}
        aria-label={`Take a point from ${team.name}`}
        className="rounded-lg p-1.5 hover:bg-black/15 transition-colors cursor-pointer"
      >
        <Minus size={15} />
      </button>
      <input
        type="number"
        value={team.score}
        onChange={(e) =>
          dispatch({
            type: "set-score",
            teamId: team.id,
            score: Number(e.target.value) || 0,
          })
        }
        aria-label={`${team.name} score`}
        className="w-12 bg-transparent text-center font-mono text-lg font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => dispatch({ type: "add-score", teamId: team.id, delta: 1 })}
        aria-label={`Give a point to ${team.name}`}
        className="rounded-lg p-1.5 hover:bg-black/15 transition-colors cursor-pointer"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function MemberRow({
  person,
  team,
  teams,
}: {
  person: Person;
  team: Team;
  teams: Team[];
}) {
  const { dispatch } = useSession();
  const others = teams.filter((t) => t.id !== team.id);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm"
    >
      <span className="truncate">{person.name}</span>
      <Popover
        trigger={({ toggle }) => (
          <button
            onClick={toggle}
            aria-label={`Options for ${person.name}`}
            className="rounded-md p-1 text-muted hover:text-foreground hover:bg-foreground/5 cursor-pointer opacity-60 hover:opacity-100"
          >
            <MoreHorizontal size={15} />
          </button>
        )}
      >
        {(close) => (
          <>
            {others.map((other) => (
              <MenuItem
                key={other.id}
                onClick={() => {
                  dispatch({
                    type: "move-person",
                    personId: person.id,
                    toTeamId: other.id,
                  });
                  close();
                }}
              >
                <ArrowRight size={14} />
                <span className="truncate">Move to {other.name}</span>
              </MenuItem>
            ))}
            <MenuItem
              danger
              onClick={() => {
                dispatch({ type: "remove-person", personId: person.id });
                close();
              }}
            >
              <UserX size={14} /> Remove from session
            </MenuItem>
          </>
        )}
      </Popover>
    </motion.li>
  );
}

function TeamCard({
  team,
  index,
  leading,
}: {
  team: Team;
  index: number;
  leading: boolean;
}) {
  const { state, dispatch } = useSession();
  const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
  const byId = new Map(state.people.map((p) => [p.id, p]));
  const members = team.memberIds
    .map((id) => byId.get(id))
    .filter((p): p is Person => p !== undefined);
  const scoring = state.settings.scoringEnabled;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: "spring", bounce: 0.3 }}
      className="rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div
        className="relative overflow-hidden rounded-t-2xl px-4 py-3 flex items-center justify-between gap-2"
        style={{ backgroundColor: color.base, color: color.contrast }}
      >
        <span
          aria-hidden
          className="absolute -right-1 -top-4 font-display font-bold text-[64px] leading-none opacity-15 select-none"
        >
          {index + 1}
        </span>
        <div className="relative flex flex-1 items-center gap-1.5 min-w-0">
          {scoring && leading && <Crown size={16} className="shrink-0" />}
          <input
            value={team.name}
            onChange={(e) =>
              dispatch({ type: "rename-team", teamId: team.id, name: e.target.value })
            }
            aria-label="Team name"
            className="bg-transparent font-display font-bold text-base min-w-0 w-full focus:outline-none focus:border-b border-current/50 placeholder:opacity-60"
            placeholder="Team name"
          />
        </div>
        {scoring && (
          <div className="relative shrink-0">
            <ScoreControls team={team} />
          </div>
        )}
      </div>
      <ul className="p-2">
        <AnimatePresence initial={false}>
          {members.map((person) => (
            <MemberRow
              key={person.id}
              person={person}
              team={team}
              teams={state.teams}
            />
          ))}
        </AnimatePresence>
        {members.length === 0 && (
          <li className="px-2.5 py-1.5 text-sm text-muted italic">Empty team</li>
        )}
      </ul>
    </motion.article>
  );
}

function Leaderboard() {
  const { state } = useSession();
  const ranked = [...state.teams].sort((a, b) => b.score - a.score);
  return (
    <ol className="flex flex-wrap gap-2 mb-4">
      {ranked.map((team, i) => {
        const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
        return (
          <li
            key={team.id}
            className="flex items-center gap-2 rounded-full border border-border bg-surface pl-1.5 pr-3 py-1 text-sm"
          >
            <span
              className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ backgroundColor: color.base, color: color.contrast }}
            >
              {i + 1}
            </span>
            <span className="font-medium truncate max-w-32">{team.name}</span>
            <span className="font-mono font-semibold">{team.score}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function TeamBoard() {
  const { state } = useSession();
  const toast = useToast();
  const scoring = state.settings.scoringEnabled;
  const topScore = Math.max(...state.teams.map((t) => t.score), 0);
  const hasScores = state.teams.some((t) => t.score !== 0);
  const [busy, setBusy] = useState<"excel" | "pdf" | null>(null);

  if (state.teams.length === 0) {
    return (
      <div className="h-full min-h-64 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center gap-3 p-8">
        <div className="flex -space-x-2">
          {TEAM_COLORS.slice(0, 4).map((color) => (
            <span
              key={color.name}
              className="w-9 h-9 rounded-full border-2 border-background"
              style={{ backgroundColor: color.base }}
            />
          ))}
        </div>
        <p className="text-muted text-sm max-w-60">
          Your teams will show up here. Add people, then hit{" "}
          <strong className="text-foreground">Generate teams</strong>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="font-display font-semibold text-lg">Teams</h2>
        <Popover
          trigger={({ toggle }) => (
            <Button size="sm" onClick={toggle}>
              <Share2 size={15} /> Share
            </Button>
          )}
        >
          {(close) => (
            <>
              <MenuItem
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(teamsToText(state));
                    toast("Teams copied to clipboard");
                  } catch {
                    toast("Couldn't access the clipboard");
                  }
                  close();
                }}
              >
                <Copy size={14} /> Copy as text
              </MenuItem>
              <MenuItem
                onClick={() => {
                  downloadCsv(state);
                  close();
                }}
              >
                <Download size={14} /> Download CSV
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  setBusy("excel");
                  try {
                    await downloadExcel(state);
                  } catch {
                    toast("Couldn't create the Excel file");
                  } finally {
                    setBusy(null);
                  }
                  close();
                }}
              >
                {busy === "excel" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <FileSpreadsheet size={14} />
                )}
                Download Excel
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  setBusy("pdf");
                  try {
                    await downloadPdf(state);
                  } catch {
                    toast("Couldn't create the PDF");
                  } finally {
                    setBusy(null);
                  }
                  close();
                }}
              >
                {busy === "pdf" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <FileText size={14} />
                )}
                Download PDF
              </MenuItem>
            </>
          )}
        </Popover>
      </div>

      {scoring && hasScores && <Leaderboard />}

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {state.teams.map((team, index) => (
          <TeamCard
            key={team.id}
            team={team}
            index={index}
            leading={scoring && hasScores && team.score === topScore}
          />
        ))}
      </div>
    </div>
  );
}

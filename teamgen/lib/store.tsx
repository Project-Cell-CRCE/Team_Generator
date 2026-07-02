"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { nanoid } from "nanoid";
import { useAuth } from "./auth";
import { saveSession } from "./sessions";
import { assignLatecomer, generateTeams } from "./teams";
import type { Person, SessionState, Settings } from "./types";

const DRAFT_KEY = "teamgen:draft";

export function newSession(): SessionState {
  return {
    id: nanoid(12),
    name: "Untitled session",
    people: [],
    teams: [],
    settings: { mode: "teams", count: 2, scoringEnabled: false },
    generatedAt: null,
    updatedAt: Date.now(),
  };
}

export type Action =
  | { type: "add-people"; names: string[] }
  | { type: "remove-person"; personId: string }
  | { type: "clear-people" }
  | { type: "set-settings"; settings: Partial<Settings> }
  | { type: "generate" }
  | { type: "move-person"; personId: string; toTeamId: string }
  | { type: "rename-team"; teamId: string; name: string }
  | { type: "add-score"; teamId: string; delta: number }
  | { type: "set-score"; teamId: string; score: number }
  | { type: "rename-session"; name: string }
  | { type: "load-session"; state: SessionState }
  | { type: "new-session" };

function touch(state: SessionState): SessionState {
  return { ...state, updatedAt: Date.now() };
}

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "add-people": {
      const existing = new Set(state.people.map((p) => p.name.toLowerCase()));
      const added: Person[] = action.names
        .filter((name) => !existing.has(name.toLowerCase()))
        .map((name) => ({ id: nanoid(8), name }));
      if (added.length === 0) return state;
      let teams = state.teams;
      if (state.generatedAt !== null && teams.length > 0) {
        // Late additions join the smallest team without reshuffling anyone.
        for (const person of added) {
          teams = assignLatecomer(teams, person.id);
        }
      }
      return touch({ ...state, people: [...state.people, ...added], teams });
    }
    case "remove-person":
      return touch({
        ...state,
        people: state.people.filter((p) => p.id !== action.personId),
        teams: state.teams.map((t) => ({
          ...t,
          memberIds: t.memberIds.filter((id) => id !== action.personId),
        })),
      });
    case "clear-people":
      return touch({ ...state, people: [], teams: [], generatedAt: null });
    case "set-settings":
      return touch({
        ...state,
        settings: { ...state.settings, ...action.settings },
      });
    case "generate":
      if (state.people.length < 2) return state;
      return touch({
        ...state,
        teams: generateTeams(state.people, state.settings),
        generatedAt: Date.now(),
      });
    case "move-person":
      return touch({
        ...state,
        teams: state.teams.map((t) => {
          const without = t.memberIds.filter((id) => id !== action.personId);
          return t.id === action.toTeamId
            ? { ...t, memberIds: [...without, action.personId] }
            : { ...t, memberIds: without };
        }),
      });
    case "rename-team":
      return touch({
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.teamId ? { ...t, name: action.name } : t,
        ),
      });
    case "add-score":
      return touch({
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.teamId ? { ...t, score: t.score + action.delta } : t,
        ),
      });
    case "set-score":
      return touch({
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.teamId ? { ...t, score: action.score } : t,
        ),
      });
    case "rename-session":
      return touch({ ...state, name: action.name || "Untitled session" });
    case "load-session":
      return action.state;
    case "new-session":
      return newSession();
  }
}

interface StoreValue {
  state: SessionState;
  dispatch: Dispatch<Action>;
  /** false until the localStorage draft has been read on the client */
  hydrated: boolean;
  /** "saving" | "saved" | null (null = guest / nothing to save yet) */
  saveStatus: "saving" | "saved" | null;
}

const StoreContext = createContext<StoreValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, newSession);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | null>(null);
  const { user } = useAuth();
  const skipNextSave = useRef(true);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        dispatch({ type: "load-session", state: JSON.parse(draft) });
      }
    } catch {
      // A corrupt draft just means starting fresh.
    }
    // One-time client hydration from localStorage has to happen in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable; the session still works in memory.
    }
  }, [state, hydrated]);

  // Debounced autosave to Firestore for signed-in users.
  useEffect(() => {
    if (!hydrated || !user) return;
    if (state.people.length === 0 && state.teams.length === 0) return;
    if (skipNextSave.current) {
      // Don't re-save the state we just loaded.
      skipNextSave.current = false;
      return;
    }
    setSaveStatus("saving");
    const uid = user.uid;
    const timer = setTimeout(async () => {
      try {
        await saveSession(uid, state);
        setSaveStatus("saved");
      } catch {
        setSaveStatus(null);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [state, user, hydrated]);

  return (
    <StoreContext.Provider value={{ state, dispatch, hydrated, saveStatus }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useSession(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}

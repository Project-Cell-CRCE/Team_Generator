import { nanoid } from "nanoid";
import type { Person, Settings, Team } from "./types";

export interface TeamColor {
  name: string;
  /** Solid jersey color, used for the card band */
  base: string;
  /** Readable text on top of `base` */
  contrast: string;
}

export const TEAM_COLORS: TeamColor[] = [
  { name: "Red", base: "#E5484D", contrast: "#FFFFFF" },
  { name: "Blue", base: "#0588F0", contrast: "#FFFFFF" },
  { name: "Amber", base: "#FFB224", contrast: "#2A2109" },
  { name: "Green", base: "#2F9E68", contrast: "#FFFFFF" },
  { name: "Violet", base: "#6E56CF", contrast: "#FFFFFF" },
  { name: "Orange", base: "#F76B15", contrast: "#FFFFFF" },
  { name: "Teal", base: "#12A594", contrast: "#FFFFFF" },
  { name: "Pink", base: "#D6409F", contrast: "#FFFFFF" },
];

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

/** Mix a hex color toward white; amount 0 = original color, 1 = white. */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

const TEAM_MASCOTS = [
  "Foxes",
  "Sharks",
  "Bees",
  "Frogs",
  "Wolves",
  "Tigers",
  "Otters",
  "Flamingos",
  "Owls",
  "Bears",
  "Falcons",
  "Pandas",
];

export function defaultTeamName(index: number): string {
  const mascot = TEAM_MASCOTS[index % TEAM_MASCOTS.length];
  const color = TEAM_COLORS[index % TEAM_COLORS.length].name;
  return `${color} ${mascot}`;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function teamCountFor(peopleCount: number, settings: Settings): number {
  const count = Math.max(1, Math.floor(settings.count));
  if (settings.mode === "teams") return Math.min(count, Math.max(peopleCount, 1));
  return Math.max(1, Math.ceil(peopleCount / count));
}

/** Shuffle everyone and deal them round-robin into teams. */
export function generateTeams(people: Person[], settings: Settings): Team[] {
  const numTeams = teamCountFor(people.length, settings);
  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    id: nanoid(8),
    name: defaultTeamName(i),
    colorIndex: i % TEAM_COLORS.length,
    memberIds: [],
    score: 0,
  }));
  shuffle(people).forEach((person, i) => {
    teams[i % numTeams].memberIds.push(person.id);
  });
  return teams;
}

/** Put a latecomer on the smallest team (random among ties), keeping existing assignments. */
export function assignLatecomer(teams: Team[], personId: string): Team[] {
  const smallest = Math.min(...teams.map((t) => t.memberIds.length));
  const candidates = teams.filter((t) => t.memberIds.length === smallest);
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  return teams.map((t) =>
    t.id === target.id ? { ...t, memberIds: [...t.memberIds, personId] } : t,
  );
}

/** Split raw typed/pasted text into clean, de-duplicated names. */
export function splitNames(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(/[\n,;\t]+/)
    .map((name) => name.trim().replace(/\s+/g, " "))
    .filter((name) => {
      if (!name) return false;
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

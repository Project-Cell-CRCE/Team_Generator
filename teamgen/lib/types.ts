export interface Person {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  /** Index into TEAM_COLORS */
  colorIndex: number;
  memberIds: string[];
  score: number;
}

export type SplitMode = "teams" | "size";

export interface Settings {
  mode: SplitMode;
  /** Number of teams (mode "teams") or people per team (mode "size") */
  count: number;
  scoringEnabled: boolean;
}

export interface SessionState {
  id: string;
  name: string;
  people: Person[];
  teams: Team[];
  settings: Settings;
  generatedAt: number | null;
  updatedAt: number;
}

export interface SessionSummary {
  id: string;
  name: string;
  peopleCount: number;
  teamCount: number;
  updatedAt: number;
}

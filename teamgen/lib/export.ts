import type { Person, SessionState } from "./types";

export function membersOf(state: SessionState, memberIds: string[]): Person[] {
  const byId = new Map(state.people.map((p) => [p.id, p]));
  return memberIds
    .map((id) => byId.get(id))
    .filter((p): p is Person => p !== undefined);
}

export function fileBaseName(state: SessionState): string {
  return state.name.replace(/[^\w\- ]+/g, "").trim() || "teams";
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function teamsToText(state: SessionState): string {
  return state.teams
    .map((team) => {
      const header = state.settings.scoringEnabled
        ? `${team.name} — ${team.score} pts`
        : team.name;
      const members = membersOf(state, team.memberIds)
        .map((p) => `  • ${p.name}`)
        .join("\n");
      return `${header}\n${members}`;
    })
    .join("\n\n");
}

export function teamsToCsv(state: SessionState): string {
  const escape = (value: string) =>
    /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const lines = [["Team", "Name", ...(state.settings.scoringEnabled ? ["Score"] : [])]];
  for (const team of state.teams) {
    for (const person of membersOf(state, team.memberIds)) {
      lines.push([
        team.name,
        person.name,
        ...(state.settings.scoringEnabled ? [String(team.score)] : []),
      ]);
    }
  }
  return lines.map((line) => line.map(escape).join(",")).join("\n");
}

export function downloadCsv(state: SessionState) {
  const blob = new Blob([teamsToCsv(state)], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `${fileBaseName(state)}.csv`);
}

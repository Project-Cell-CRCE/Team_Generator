import { fileBaseName, membersOf, triggerDownload } from "./export";
import { lighten, TEAM_COLORS } from "./teams";
import type { SessionState } from "./types";

const argb = (hex: string) => `FF${hex.replace("#", "").toUpperCase()}`;

export async function downloadExcel(state: SessionState) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "TeamGen";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Teams", {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  const scoring = state.settings.scoringEnabled;
  const rosters = state.teams.map((team) => membersOf(state, team.memberIds));
  const columnCount = Math.max(state.teams.length, 1);

  sheet.mergeCells(1, 1, 1, columnCount);
  const title = sheet.getCell(1, 1);
  title.value = state.name;
  title.font = { size: 16, bold: true };

  sheet.mergeCells(2, 1, 2, columnCount);
  const subtitle = sheet.getCell(2, 1);
  subtitle.value = `Generated with TeamGen · ${new Date().toLocaleDateString()} · ${state.people.length} people`;
  subtitle.font = { size: 10, italic: true, color: { argb: "FF767676" } };

  const headerRow = 4;
  state.teams.forEach((team, col) => {
    const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
    const cell = sheet.getCell(headerRow, col + 1);
    const headerText = scoring ? `${team.name} — ${team.score} pts` : team.name;
    cell.value = headerText;
    cell.font = { bold: true, color: { argb: argb(color.contrast) }, size: 12 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: argb(color.base) },
    };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

    const column = sheet.getColumn(col + 1);
    const longest = rosters[col].reduce(
      (max, p) => Math.max(max, p.name.length),
      headerText.length,
    );
    column.width = Math.min(Math.max(longest + 4, 16), 40);

    const tint = argb(lighten(color.base, 0.85));
    const maxRows = Math.max(...rosters.map((r) => r.length), 0);
    for (let r = 0; r < maxRows; r++) {
      const memberCell = sheet.getCell(headerRow + 1 + r, col + 1);
      memberCell.value = rosters[col][r]?.name ?? "";
      memberCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: tint } };
      memberCell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E1DA" } },
      };
      memberCell.alignment = { vertical: "middle" };
    }
  });
  sheet.getRow(headerRow).height = 28;

  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${fileBaseName(state)}.xlsx`,
  );
}

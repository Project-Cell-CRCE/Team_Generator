import { fileBaseName, membersOf } from "./export";
import { hexToRgb, lighten, TEAM_COLORS } from "./teams";
import type { SessionState } from "./types";

export async function downloadPdf(state: SessionState) {
  const [{ default: JsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const scoring = state.settings.scoringEnabled;
  const rosters = state.teams.map((team) => membersOf(state, team.memberIds));
  const maxRows = Math.max(...rosters.map((r) => r.length), 0);

  const doc = new JsPDF({
    orientation: state.teams.length > 4 ? "landscape" : "portrait",
    unit: "pt",
    format: "a4",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(state.name, 40, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  const prefix = `Generated with `;
  doc.text(prefix, 40, 58);
  const prefixWidth = doc.getTextWidth(prefix);

  doc.setTextColor(11, 136, 84);
  doc.textWithLink("TeamGen", 40 + prefixWidth, 58, { url: "https://teamgen-pcell.vercel.app/" });
  const brandWidth = doc.getTextWidth("TeamGen");

  doc.setTextColor(120);
  doc.text(
    ` · ${new Date().toLocaleDateString()} · ${state.people.length} people`,
    40 + prefixWidth + brandWidth,
    58,
  );

  const head = [
    state.teams.map((team) => (scoring ? `${team.name} — ${team.score} pts` : team.name)),
  ];
  const body = Array.from({ length: maxRows }, (_, r) =>
    rosters.map((roster) => roster[r]?.name ?? ""),
  );

  autoTable(doc, {
    head,
    body,
    startY: 76,
    margin: { left: 40, right: 40 },
    styles: { font: "helvetica", fontSize: 11, cellPadding: 6, lineColor: [226, 225, 218] },
    headStyles: { fontStyle: "bold", halign: "center" },
    didParseCell: (data) => {
      const team = state.teams[data.column.index];
      if (!team) return;
      const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
      if (data.section === "head") {
        data.cell.styles.fillColor = hexToRgb(color.base);
        data.cell.styles.textColor = hexToRgb(color.contrast);
      } else {
        data.cell.styles.fillColor = hexToRgb(lighten(color.base, 0.88));
      }
    },
  });

  doc.save(`${fileBaseName(state)}.pdf`);
}

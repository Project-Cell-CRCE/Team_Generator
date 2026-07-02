export interface ParsedSheet {
  /** Raw cell values, rows x columns, trimmed strings */
  rows: string[][];
  columnCount: number;
  /** Best guess for the column holding names */
  suggestedColumn: number;
  /** Whether the first row looks like a header */
  hasHeader: boolean;
}

const NAME_HEADER = /^(full\s*)?name|player|student|participant|member|person/i;

export async function parseSpreadsheet(file: File): Promise<ParsedSheet> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: "",
  });

  const rows = raw
    .map((row) => row.map((cell) => String(cell ?? "").trim()))
    .filter((row) => row.some((cell) => cell !== ""));
  if (rows.length === 0) {
    throw new Error("The file has no rows with text in them.");
  }

  const columnCount = Math.max(...rows.map((row) => row.length));
  const header = rows[0];
  const headerMatch = header.findIndex((cell) => NAME_HEADER.test(cell));
  const hasHeader = headerMatch !== -1;

  let suggestedColumn = hasHeader ? headerMatch : 0;
  if (!hasHeader && columnCount > 1) {
    // Prefer the column that looks most like names: non-empty, non-numeric text.
    let bestScore = -1;
    for (let c = 0; c < columnCount; c++) {
      const score = rows.reduce((acc, row) => {
        const cell = row[c] ?? "";
        return acc + (cell !== "" && Number.isNaN(Number(cell)) ? 1 : 0);
      }, 0);
      if (score > bestScore) {
        bestScore = score;
        suggestedColumn = c;
      }
    }
  }

  return { rows, columnCount, suggestedColumn, hasHeader };
}

export function namesFromColumn(
  sheet: ParsedSheet,
  column: number,
  skipHeader: boolean,
): string[] {
  const rows = skipHeader ? sheet.rows.slice(1) : sheet.rows;
  const seen = new Set<string>();
  return rows
    .map((row) => (row[column] ?? "").trim().replace(/\s+/g, " "))
    .filter((name) => {
      if (!name) return false;
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

"use client";

import { useRef, useState, type DragEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileSpreadsheet, Plus, Trash2, X } from "lucide-react";
import { namesFromColumn, parseSpreadsheet, type ParsedSheet } from "@/lib/parse";
import { splitNames } from "@/lib/teams";
import { useSession } from "@/lib/store";
import { useToast } from "./Toast";
import { Button, Dialog, cx } from "./ui";

function ImportDialog({
  sheet,
  fileName,
  onClose,
}: {
  sheet: ParsedSheet;
  fileName: string;
  onClose: () => void;
}) {
  const { dispatch } = useSession();
  const toast = useToast();
  const [column, setColumn] = useState(sheet.suggestedColumn);
  const [skipHeader, setSkipHeader] = useState(sheet.hasHeader);

  const names = namesFromColumn(sheet, column, skipHeader);
  const preview = sheet.rows.slice(0, 6);

  return (
    <Dialog open onClose={onClose} title={`Import from ${fileName}`}>
      {sheet.columnCount > 1 && (
        <p className="text-sm text-muted mb-3">
          Pick the column that holds the names.
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border mb-4">
        <table className="text-sm w-full">
          <tbody>
            {preview.map((row, r) => (
              <tr key={r} className={cx(r === 0 && skipHeader && "text-muted italic")}>
                {Array.from({ length: sheet.columnCount }, (_, c) => (
                  <td
                    key={c}
                    onClick={() => setColumn(c)}
                    className={cx(
                      "px-3 py-1.5 whitespace-nowrap max-w-40 truncate cursor-pointer border-b border-border last:border-b-0",
                      c === column
                        ? "bg-accent-soft text-foreground font-medium"
                        : "text-muted",
                    )}
                  >
                    {row[c] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sheet.rows.length > preview.length && (
        <p className="text-xs text-muted mb-3">
          Showing the first {preview.length} of {sheet.rows.length} rows.
        </p>
      )}
      <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={skipHeader}
          onChange={(e) => setSkipHeader(e.target.checked)}
          className="accent-(--accent) w-4 h-4"
        />
        First row is a header — skip it
      </label>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={names.length === 0}
          onClick={() => {
            dispatch({ type: "add-people", names });
            toast(`Imported ${names.length} ${names.length === 1 ? "name" : "names"}`);
            onClose();
          }}
        >
          Import {names.length} {names.length === 1 ? "name" : "names"}
        </Button>
      </div>
    </Dialog>
  );
}

export function PeoplePanel() {
  const { state, dispatch } = useSession();
  const toast = useToast();
  const [draft, setDraft] = useState("");
  const [dragging, setDragging] = useState(false);
  const [importState, setImportState] = useState<{
    sheet: ParsedSheet;
    fileName: string;
  } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const generated = state.generatedAt !== null;

  const addFromDraft = () => {
    const names = splitNames(draft);
    if (names.length === 0) return;
    dispatch({ type: "add-people", names });
    setDraft("");
    if (generated) {
      toast(
        names.length === 1
          ? `${names[0]} joined a team`
          : `${names.length} people joined teams`,
      );
    }
  };

  const handleFile = async (file: File) => {
    try {
      const sheet = await parseSpreadsheet(file);
      setImportState({ sheet, fileName: file.name });
    } catch (error) {
      toast(error instanceof Error ? error.message : "Couldn't read that file");
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cx(
        "rounded-2xl border bg-surface p-4 sm:p-5 transition-colors",
        dragging ? "border-accent border-dashed bg-accent-soft" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="font-display font-semibold">
          People{" "}
          <span className="text-muted font-normal text-sm">
            {state.people.length > 0 && `· ${state.people.length}`}
          </span>
        </h2>
        {state.people.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "clear-people" })}
          >
            <Trash2 size={14} /> Clear
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromDraft();
            }
          }}
          placeholder={
            generated ? "Someone new? Type their name…" : "Type a name, press Enter"
          }
          enterKeyHint="done"
          className="flex-1 min-w-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted focus:outline-2 focus:outline-accent"
        />
        <Button
          variant="primary"
          onClick={addFromDraft}
          disabled={draft.trim() === ""}
          aria-label="Add name"
        >
          <Plus size={17} />
        </Button>
      </div>

      <p className="text-xs text-muted mb-3">
        Tip: paste a whole list — names split on commas or new lines.
      </p>

      {state.people.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 max-h-56 overflow-y-auto">
          <AnimatePresence initial={false}>
            {state.people.map((person) => (
              <motion.span
                key={person.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 rounded-full bg-foreground/6 pl-3 pr-1.5 py-1 text-sm"
              >
                {person.name}
                <button
                  onClick={() => dispatch({ type: "remove-person", personId: person.id })}
                  aria-label={`Remove ${person.name}`}
                  className="rounded-full p-0.5 text-muted hover:text-danger cursor-pointer"
                >
                  <X size={13} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="w-full rounded-xl border border-dashed border-border hover:border-accent hover:bg-accent-soft/50 transition-colors px-4 py-3 text-sm text-muted hover:text-foreground flex items-center justify-center gap-2 cursor-pointer"
      >
        <FileSpreadsheet size={16} />
        Import CSV or Excel — or drop a file here
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {importState && (
        <ImportDialog
          sheet={importState.sheet}
          fileName={importState.fileName}
          onClose={() => setImportState(null)}
        />
      )}
    </section>
  );
}

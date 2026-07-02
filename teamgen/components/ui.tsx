"use client";

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-strong shadow-sm font-semibold",
  secondary:
    "bg-surface border border-border hover:border-muted/60 text-foreground",
  ghost: "text-muted hover:text-foreground hover:bg-foreground/5",
  danger: "text-danger hover:bg-danger/10",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-xl transition-colors cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:opacity-45 disabled:pointer-events-none",
        size === "sm" && "text-sm px-2.5 py-1.5",
        size === "md" && "text-sm px-3.5 py-2",
        size === "lg" && "text-base px-5 py-3",
        buttonStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        checked ? "bg-accent" : "bg-border",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="inline-flex rounded-xl bg-foreground/6 p-1 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cx(
            "px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer",
            "focus-visible:outline-2 focus-visible:outline-accent",
            value === option.value
              ? "bg-surface shadow-sm font-medium text-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface border border-border shadow-xl p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Small anchored popover menu; closes on outside click or Escape. */
export function Popover({
  trigger,
  children,
  align = "end",
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          className={cx(
            "absolute z-40 mt-1.5 min-w-44 rounded-xl border border-border bg-surface shadow-lg p-1",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  onClick,
  children,
  danger,
}: {
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors cursor-pointer",
        danger ? "text-danger hover:bg-danger/10" : "hover:bg-foreground/5",
      )}
    >
      {children}
    </button>
  );
}

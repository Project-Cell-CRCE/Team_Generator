"use client";

import Link from "next/link";
import { Cloud, FolderOpen, Info, LogOut, Moon, Sun, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSession } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { Button, MenuItem, Popover } from "./ui";

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.4 34.9 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

function AuthArea() {
  const { user, loading, enabled, signIn, signOut } = useAuth();
  const { saveStatus } = useSession();

  if (!enabled) return null;
  if (loading) return <div className="w-8 h-8 rounded-full bg-foreground/10" />;

  if (!user) {
    return (
      <Button size="sm" onClick={() => signIn().catch(() => {})}>
        <GoogleMark />
        <span className="hidden sm:inline">Sign in to save</span>
        <span className="sm:hidden">Sign in</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {saveStatus && (
        <span className="hidden sm:flex items-center gap-1 text-xs text-muted">
          <Cloud size={13} />
          {saveStatus === "saving" ? "Saving…" : "Saved"}
        </span>
      )}
      <Popover
        trigger={({ toggle }) => (
          <button
            onClick={toggle}
            aria-label="Account menu"
            className="rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt=""
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-border"
              />
            ) : (
              <span className="flex w-8 h-8 rounded-full bg-accent text-accent-foreground items-center justify-center text-sm font-semibold">
                {(user.displayName ?? "?").charAt(0)}
              </span>
            )}
          </button>
        )}
      >
        {(close) => (
          <>
            <div className="px-3 py-2 text-sm">
              <div className="font-medium truncate">{user.displayName}</div>
              <div className="text-muted text-xs truncate">{user.email}</div>
            </div>
            <div className="h-px bg-border my-1" />
            <MenuItem
              onClick={() => {
                close();
                signOut();
              }}
            >
              <LogOut size={15} /> Sign out
            </MenuItem>
          </>
        )}
      </Popover>
    </div>
  );
}

export function Header() {
  const { user, enabled } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-bold text-lg tracking-tight"
        >
          <span className="flex w-7 h-7 rounded-lg bg-accent text-accent-foreground items-center justify-center">
            <Users size={16} strokeWidth={2.5} />
          </span>
          TeamGen
        </Link>
        <div className="flex items-center gap-1.5">
          {enabled && user && (
            <Link href="/sessions">
              <Button variant="ghost" size="sm">
                <FolderOpen size={16} />
                <span className="hidden sm:inline">My sessions</span>
              </Button>
            </Link>
          )}
          <Link href="/about">
            <Button variant="ghost" size="sm">
              <Info size={16} />
              <span className="hidden sm:inline">About</span>
            </Button>
          </Link>
          <ThemeToggle />
          <AuthArea />
        </div>
      </div>
    </header>
  );
}

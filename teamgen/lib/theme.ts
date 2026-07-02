"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("teamgen:theme", next ? "dark" : "light");
    } catch {}
    listeners.forEach((listener) => listener());
  };

  return { dark, toggle };
}

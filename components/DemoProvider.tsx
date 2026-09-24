"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DemoState, freshState } from "../lib/demo";

const STORAGE_KEY = "mara-studio-demo-v1";

type DemoContextValue = {
  state: DemoState;
  setState: React.Dispatch<React.SetStateAction<DemoState>>;
  resetDemo: () => void;
  announce: string;
  setAnnounce: (value: string) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function parseStored(raw: string | null): DemoState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) return null;
    if (!Array.isArray(parsed.artworks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => freshState());
  const [hydrated, setHydrated] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const stored = parseStored(window.localStorage.getItem(STORAGE_KEY));
    const next = stored ?? freshState();
    setState(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const incoming = parseStored(event.newValue);
      if (incoming) setState(incoming);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<DemoContextValue>(() => ({
    state,
    setState,
    announce,
    setAnnounce,
    resetDemo: () => {
      const next = freshState();
      setState(next);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setAnnounce("Demonstration data reset.");
    }
  }), [state, announce]);

  return (
    <DemoContext.Provider value={value}>
      <div className="sr-only" aria-live="polite">{announce}</div>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}

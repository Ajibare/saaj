"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "saaj-bw-mode";
const CHANGE_EVENT = "saaj-bw-change";

type ThemeContextValue = {
  isBlackAndWhite: boolean;
  toggleBlackAndWhite: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

let current = false;

function readStored(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getSnapshot(): boolean {
  return current;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  current = readStored();

  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) {
      current = readStored();
      callback();
    }
  };
  const onCustom = () => {
    current = readStored();
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onCustom);
  };
}

function writeStored(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isBlackAndWhite = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.classList.toggle("bw", isBlackAndWhite);
    try {
      window.localStorage.setItem(STORAGE_KEY, isBlackAndWhite ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  }, [isBlackAndWhite]);

  const toggleBlackAndWhite = useCallback(() => {
    writeStored(!readStored());
  }, []);

  return (
    <ThemeContext.Provider value={{ isBlackAndWhite, toggleBlackAndWhite }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { demoUser, greetingFor, handleFromName, STORAGE_KEY } from "./mock";
import type { Profile } from "./types";

type SessionContextValue = {
  user: Profile | null;
  ready: boolean;
  login: (email: string, name?: string) => Profile;
  signup: (name: string, email: string) => Profile;
  update: (patch: Partial<Profile>) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const listeners = new Set<() => void>();
let memory: Profile | null | undefined;

function emit() {
  memory = undefined;
  listeners.forEach((listener) => listener());
}

function read(): Profile | null {
  if (typeof window === "undefined") return null;
  if (memory !== undefined) return memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    memory = null;
  }
  return memory;
}

function write(next: Profile | null) {
  if (typeof window === "undefined") return;
  if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  else localStorage.removeItem(STORAGE_KEY);
  memory = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function freshUser(name: string, email: string): Profile {
  const handle = handleFromName(name);
  return {
    name,
    email,
    handle,
    role: "",
    skills: [],
    voice: "Alex",
    language: "en",
    personality: "professional",
    formality: 0.3,
    verbosity: 0.5,
    greeting: greetingFor(name),
    hasResume: false,
    hasAgent: false,
    agentId: handle,
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, read, () => null);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const login = useCallback((email: string, name?: string) => {
    const existing = read();
    if (existing && existing.email === email) {
      write(existing);
      return existing;
    }
    if (email.toLowerCase() === demoUser.email) {
      write(demoUser);
      return demoUser;
    }
    const next = existing ?? freshUser(name || "Waseem Javed", email);
    write(next);
    return next;
  }, []);

  const signup = useCallback((name: string, email: string) => {
    const next = freshUser(name.trim() || "Waseem Javed", email.trim());
    write(next);
    return next;
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    const current = read();
    if (!current) return;
    write({ ...current, ...patch });
  }, []);

  const logout = useCallback(() => write(null), []);

  const value = useMemo(
    () => ({ user, ready, login, signup, update, logout }),
    [user, ready, login, signup, update, logout],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

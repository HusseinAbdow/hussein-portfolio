"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { WordsCtaSession } from "@/components/words/wordsSession";

interface WordsSessionContextValue {
  session: WordsCtaSession;
  refreshSession: () => Promise<void>;
  /** Increments on each request to open the edit flow (from card menus). */
  editRequestCount: number;
  openEditFlow: () => void;
}

const WordsSessionContext = createContext<WordsSessionContextValue | null>(null);

// Shared client-side session state for the words section: the card grid
// (ownership check) and the CTA/modal both read from this single source,
// resolved with the same /api/auth/session call the edit feature already uses.
export function WordsSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<WordsCtaSession>({ status: "idle" });
  const [editRequestCount, setEditRequestCount] = useState(0);

  const refreshSession = useCallback(async () => {
    setSession({ status: "loading" });
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json().catch(() => null);
      if (res.ok && data?.authenticated && data.identity) {
        setSession({
          status: "authenticated",
          identity: data.identity,
          existingSubmission: data.existingSubmission ?? null,
        });
      } else {
        setSession({ status: "anonymous" });
      }
    } catch {
      setSession({ status: "error" });
    }
  }, []);

  const openEditFlow = useCallback(() => {
    setEditRequestCount((count) => count + 1);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return (
    <WordsSessionContext.Provider
      value={{ session, refreshSession, editRequestCount, openEditFlow }}
    >
      {children}
    </WordsSessionContext.Provider>
  );
}

export function useWordsSession(): WordsSessionContextValue {
  const value = useContext(WordsSessionContext);
  if (!value) {
    throw new Error("useWordsSession must be used inside WordsSessionProvider");
  }
  return value;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { SelectableProject } from "@/lib/words/manualProjects";
import { useWordsSession } from "@/components/words/wordsSessionProvider";
import WordsModal from "@/components/words/WordsModal";

export default function WordsCta({
  selectableProjects,
}: {
  selectableProjects: SelectableProject[];
}) {
  const { session, refreshSession, editRequestCount } = useWordsSession();
  const [open, setOpen] = useState(false);
  const [signInError, setSignInError] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
    setSignInError(false);
  }, []);

  // Handles the return trip from GitHub OAuth: `/?words=open` reopens the
  // submission flow, `auth_error` surfaces a friendly sign-in failure message.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autoOpen = params.get("words") === "open";
    const authError = params.get("auth_error");

    if (!autoOpen && !authError) return;

    params.delete("words");
    params.delete("auth_error");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (query ? `?${query}` : "") + window.location.hash
    );

    if (authError) setSignInError(true);
    openModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Card kebab menus request the edit flow by bumping editRequestCount —
  // this opens the SAME modal/handler as the "Edit your entry" CTA below.
  useEffect(() => {
    if (editRequestCount > 0) {
      openModal();
    }
  }, [editRequestCount, openModal]);

  const hasExistingEntry =
    session.status === "authenticated" && session.existingSubmission !== null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="group inline-flex items-center gap-2.5 rounded-full border border-accentUx/60 bg-transparent px-8 py-3.5 font-body text-[14px] font-medium tracking-[0.08em] text-ink transition-colors hover:bg-accentUx hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4"
      >
        <span>{hasExistingEntry ? "Edit your entry" : "Have something to say?"}</span>
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </button>

      <WordsModal
        open={open}
        onClose={() => setOpen(false)}
        session={session}
        onRetrySession={refreshSession}
        signInError={signInError}
        selectableProjects={selectableProjects}
      />
    </>
  );
}

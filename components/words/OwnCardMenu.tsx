"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import { useWordsSession } from "@/components/words/wordsSessionProvider";

// Kebab menu on the visitor's OWN card only. Renders nothing on the server
// and for non-owners — ownership is resolved client-side by matching the
// card's submission id against the session's existingSubmission.id, so no
// ownership indication ever leaks to other visitors or into the SSR HTML.
export default function OwnCardMenu({ submissionId }: { submissionId: string }) {
  const { session, openEditFlow } = useWordsSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwn =
    session.status === "authenticated" &&
    session.existingSubmission?.id === submissionId;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  if (!isOwn) return null;

  return (
    <div ref={menuRef} className="absolute right-3 top-3 z-10">
      <button
        type="button"
        aria-label="Entry options"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-md p-1 text-muted/30 transition-colors duration-200 hover:bg-bg/60 hover:text-ink focus-visible:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2"
      >
        <MoreVertical size={16} strokeWidth={2} />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-36 overflow-hidden rounded-lg border border-border bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              // Reuses the same edit flow/modal the CTA triggers.
              openEditFlow();
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 font-body text-[13px] text-ink transition-colors hover:bg-bg/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:-outline-offset-2"
          >
            <Pencil size={13} aria-hidden className="text-muted" />
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

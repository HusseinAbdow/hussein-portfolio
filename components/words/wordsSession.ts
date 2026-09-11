import type { ProviderIdentityPublic, WordsExistingSubmission } from "@/lib/words/types";

export type { WordsExistingSubmission };

export type WordsCtaSession =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "authenticated";
      identity: ProviderIdentityPublic;
      existingSubmission: WordsExistingSubmission | null;
    }
  | { status: "anonymous" }
  | { status: "error" };

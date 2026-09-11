import { createSupabaseAnonClient } from "@/lib/supabase/server";
import { toPublicWord } from "@/lib/words/types";
import type { PublicWordSubmission } from "@/lib/words/types";
import { getSelectableProjects } from "@/lib/words/manualProjects";
import WordCard from "@/components/words/WordCard";
import WordsCta from "@/components/words/WordsCta";
import { WordsSessionProvider } from "@/components/words/wordsSessionProvider";
import ScrollReveal from "@/components/ScrollReveal";

const MAX_WALL_SUBMISSIONS = 30;

async function getApprovedSubmissions(): Promise<PublicWordSubmission[]> {
  try {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("words_submissions")
      .select(
        "id, provider, provider_id, github_user_id, github_username, display_name, avatar_url, profile_url, message, relationships, project_slug, project_slugs, status, created_at, updated_at"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(MAX_WALL_SUBMISSIONS);

    return data ? data.map(toPublicWord) : [];
  } catch (err) {
    console.error("Failed to load words wall:", err);
    return [];
  }
}

export default async function WordsSection() {
  const submissions = await getApprovedSubmissions();
  const selectableProjects = getSelectableProjects();

  return (
    <section id="words" className="bg-bg px-6 py-12 md:px-16 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10 md:mb-14">
          <ScrollReveal delay={80} distance={12} duration={400}>
            <p className="mb-3 font-body text-[12px] tracking-[0.12em] uppercase text-muted">
              Collaborators &amp; Friends
            </p>
          </ScrollReveal>
          <ScrollReveal delay={160} distance={12} duration={400}>
            <h2 className="max-w-[820px] font-display text-[clamp(30px,4.5vw,56px)] leading-[1.02]">
              In their words.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={220} distance={12} duration={400}>
            <p className="mt-5 max-w-[520px] font-body text-[13px] leading-relaxed text-muted">
              Verified through GitHub or LinkedIn sign-in, and reviewed by me
              before it appears here.
            </p>
          </ScrollReveal>
        </header>

        {submissions.length > 0 ? (
          <WordsSessionProvider>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {submissions.map((submission, index) => (
                <ScrollReveal
                  key={submission.id}
                  delay={80 + index * 80}
                  distance={16}
                  duration={450}
                  className="h-full"
                >
                  <WordCard submission={submission} />
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-16 border-t border-border pt-12 md:mt-20 md:pt-16">
              <WordsCta selectableProjects={selectableProjects} />
            </div>
          </WordsSessionProvider>
        ) : (
          <ScrollReveal delay={220} distance={12} duration={400}>
            <div className="border border-border bg-surface p-8 md:p-10">
              <p className="font-display text-[20px] text-ink">
                The wall is just getting started.
              </p>
              <p className="mt-2 max-w-[520px] font-body text-[14px] leading-relaxed text-muted">
                No words have been approved yet. If we&rsquo;ve crossed paths,
                yours could be the first ones here.
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

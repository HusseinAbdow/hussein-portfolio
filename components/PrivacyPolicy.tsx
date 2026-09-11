const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "Overview",
    body: [
      "This is a personal portfolio. I collect a small amount of information so the site can do the two things it offers: let you sign in with an account you already have, and let you submit a message that may appear on the site.",
      "This policy describes what gets collected, why, and what happens to it. If anything here is unclear, reach out — details at the bottom.",
    ],
  },
  {
    heading: "What this site may collect",
    body: [
      "Depending on how you use the site, the following information may be collected:",
    ],
  },
  {
    heading: "Authentication",
    body: [
      "Signing in is optional. Authentication is handled by Supabase Auth together with the provider you choose — currently GitHub, with LinkedIn OpenID Connect on the way.",
      "When you sign in with GitHub, the site receives your GitHub profile information, such as your name or display name, avatar, and username, along with GitHub's identifier for your account.",
      "When you sign in with LinkedIn, the site receives the LinkedIn profile information made available through LinkedIn's OpenID Connect authentication, such as your name and avatar, along with LinkedIn's identifier for your account.",
      "If the provider shares your email address, the site receives that too. The site also sets the authentication and session cookies necessary to keep you signed in and operate the site.",
    ],
  },
  {
    heading: "Messages and the \u201cA Few Words\u201d section",
    body: [
      "If you choose to submit a message, the site collects what you submit: your name, your relationship selection, an optional collaborative project selection, and the message itself. Submissions also carry a status (pending or approved) and timestamps.",
      "Signing in alone does not publish anything. Nothing appears publicly until you deliberately submit a message.",
      "Submitted messages initially remain pending. Only approved submissions are displayed publicly in the \u201cA Few Words\u201d section. A publicly displayed submission may include your name, avatar, provider identity information, relationship, project context, your message, and the relevant date and metadata.",
    ],
  },
  {
    heading: "How the information is used",
    body: [
      "Information is used to operate authentication, process submissions, moderate content, maintain the security of the site, and display approved submissions.",
      "Your personal information is not sold.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "If you want an approved submission removed, or you have a question about your personal information, contact me and I will take care of it.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.03em] uppercase text-ink">
          Privacy
        </h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-muted">
          Last updated: September 11, 2026
        </p>

        <div className="mt-12 flex flex-col gap-12">
          {SECTIONS.map((section, i) => (
            <div key={i} className="border-t border-border pt-10">
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.01em] text-ink">
                {section.heading}
              </h2>
              {section.body.length > 0 && (
                <div className="mt-4 flex flex-col gap-4">
                  {section.body.map((text, j) => (
                    <p
                      key={j}
                      className="font-body text-sm md:text-[15px] leading-relaxed text-muted"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              )}
              {section.heading === "What this site may collect" && (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {COLLECTED.map((item, j) => (
                    <li
                      key={j}
                      className="font-body text-sm md:text-[15px] leading-relaxed text-muted"
                    >
                      <span aria-hidden className="text-accentUx">
                        &mdash;&nbsp;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.heading === "Your choices" && (
                <p className="mt-4 font-body text-sm md:text-[15px] leading-relaxed text-muted">
                  Contact:{" "}
                  <a
                    href="mailto:hussabdow@gmail.com"
                    className="text-accentUx hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2 rounded"
                  >
                    hussabdow@gmail.com
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COLLECTED = [
  "Name or display name",
  "Profile or avatar image",
  "GitHub username and profile information, when you use GitHub authentication",
  "LinkedIn profile information made available through LinkedIn's OpenID Connect authentication",
  "The provider-specific account or subject identifier for your account",
  "Email address, if your authentication provider provides one",
  "Relationship selection",
  "Optional collaborative project selection",
  "The message you submit",
  "Submission status and timestamps",
  "The authentication and session cookies necessary to operate the site",
];

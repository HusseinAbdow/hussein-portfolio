"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FormState = { name: string; email: string; message: string; website: string };

const initialForm: FormState = { name: "", email: "", message: "", website: "" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 font-body text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:outline-2 focus:outline-accentUx focus:outline-offset-0 focus:border-accentUx transition-colors";

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [clientError, setClientError] = useState<string | null>(null);

  const update = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Please add your name.";
    if (!EMAIL_REGEX.test(form.email.trim())) return "Please add a valid email address.";
    if (!form.message.trim()) return "Please write a short message.";
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setClientError(error);
      return;
    }
    setClientError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.03em] uppercase text-ink">
          Let&apos;s talk
        </h1>
        <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-muted">
          Got a project, a role, or just a question? Send it over — I read everything.
        </p>

        <div className="mt-12">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-border bg-surface p-8"
                >
                  <p className="font-display text-xl font-bold text-ink">
                    Thanks — I&apos;ll get back to you soon.
                  </p>
                  <p className="mt-2 font-body text-sm text-muted">
                    Your message is in my inbox. Urgent? Email me directly at{" "}
                    <a
                      href="mailto:hussabdow@gmail.com"
                      className="text-accentUx hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2 rounded"
                    >
                      hussabdow@gmail.com
                    </a>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-name" className="font-body text-xs font-medium tracking-[0.08em] uppercase text-muted">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your name"
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-email" className="font-body text-xs font-medium tracking-[0.08em] uppercase text-muted">
                       Your Emails
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@example.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="font-body text-xs font-medium tracking-[0.08em] uppercase text-muted">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="What are you building?"
                      className={`${inputClasses} resize-y`}
                    />
                  </div>

                  {/* Honeypot spam trap — hidden off-screen, real users never see or fill it */}
                  <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={update("website")}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {(clientError || status === "error") && (
                    <p className="font-body text-sm text-red-400" role="alert">
                      {clientError ?? "Something went wrong — try emailing me directly at "}
                      {status === "error" && (
                        <a
                          href="mailto:hussabdow@gmail.com"
                          className="text-accentUx hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2 rounded"
                        >
                          hussabdow@gmail.com
                        </a>
                      )}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-2 self-start inline-flex items-center gap-2 rounded-full border border-accentDev/60 px-6 py-2.5 font-body text-[13px] font-medium tracking-[0.1em] uppercase text-ink transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink"
                  >
                    {status === "sending" ? (
                      <>
                        <span
                          aria-hidden
                          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
                        />
                        Sending...
                      </>
                    ) : (
                      "SEND MESSAGE"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

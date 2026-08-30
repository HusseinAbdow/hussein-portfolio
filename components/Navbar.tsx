"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socialLinks } from "@/lib/socialLinks";

const navLinks = [
  { label: "RESUME", href: "/resume.pdf", external: true },
  { label: "ABOUT", href: "/about", external: false },
  { label: "CONTACT", href: "#contact", external: false },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isMenuOpen]);

  return (
    <nav ref={menuRef} className="relative sticky top-0 z-40 w-full h-[80px] sm:h-[88px] bg-bg border-b border-border flex justify-between items-center px-4 sm:px-6 md:px-16">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          aria-label="Hussein Abdow home"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded-full"
        >
          <Image
            src="/portrait-dev.avif"
            alt="Hussein Abdow"
            width={46}
            height={46}
            className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] rounded-full border border-ink/20 object-cover object-center"
          />
        </Link>
        <Link
          href="/"
          className="font-display font-semibold text-[15px] tracking-[0.04em] uppercase text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          HUSSEIN ABDOW
        </Link>
        <span className="inline-flex max-[360px]:hidden items-center gap-2 rounded-full border border-border px-2 py-1.5 font-body text-[11px] font-medium tracking-[0.06em] text-muted whitespace-nowrap sm:px-3">
          <span className="status-dot h-[8px] w-[8px] rounded-full bg-emerald-400" aria-hidden />
          <span className="hidden sm:inline">Open to Opportunities</span>
          <span className="sm:hidden">Open to work</span>
        </span>
      </div>
      <div className="hidden lg:flex items-center gap-8 font-body text-sm font-medium text-muted">
        {navLinks.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
            >
              {link.label}
            </Link>
          )
        )}
      </div>
      <button
        type="button"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
        className="lg:hidden rounded p-2 text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2"
      >
        {isMenuOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[calc(100%+8px)] rounded-xl border border-border bg-surface p-5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] sm:left-auto sm:right-6 sm:w-80"
          >
            <div className="flex flex-col gap-4 font-body text-sm font-medium text-muted">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2 rounded"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2 rounded"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="my-5 h-px bg-border" />
            <div className="flex items-center gap-5">
              {socialLinks.map(({ href, label, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  onClick={() => setIsMenuOpen(false)}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2 rounded"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

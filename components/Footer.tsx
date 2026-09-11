import { socialLinks } from "@/lib/socialLinks";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border py-8 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          {socialLinks.map(({ href, label, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
        <p className="font-body text-[12px] text-muted">
          &copy; {new Date().getFullYear()} Hussein Abdow{" "}
          <span aria-hidden>&middot;</span>{" "}
          <Link
            href="/privacy"
            className="transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}

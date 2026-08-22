export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full h-[72px] bg-bg border-b border-border flex justify-between items-center px-6 md:px-16">
      <div className="font-display font-semibold text-[15px] tracking-[0.04em] uppercase text-ink">
        HUSSEIN ABDOW
      </div>
      <div className="flex items-center gap-8 font-body text-sm font-medium text-muted">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          RESUME
        </a>
        <a
          href="#about"
          className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          ABOUT
        </a>
        <a
          href="#contact"
          className="hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          CONTACT
        </a>
      </div>
    </nav>
  );
}

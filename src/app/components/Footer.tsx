export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-main)] border-t border-[var(--border-color)] shrink-0 z-10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-[var(--text-secondary)]">
          &copy; Copyright 2026, Hand of Naire | 
          <a
            href="https://debank.com/profile/0x9111c47492a9043d12af0e6c46d57560eebcd9d4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 ml-1 transition-colors font-sans"
          >
            Lunairefine
          </a>
        </p>
      </div>
    </footer>
  );
}

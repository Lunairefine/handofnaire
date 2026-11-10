export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-main)] border-t border-[var(--border-color)] shrink-0 z-10 py-3">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-end items-center">
        {process.env.NEXT_PUBLIC_COMMIT_HASH && (
          <a
            href={`https://github.com/Lunairefine/handofnaire/commit/${process.env.NEXT_PUBLIC_COMMIT_HASH}`}
            target="_blank"
            rel="noopener noreferrer"
            className="commit-hash text-[11px] font-mono text-teal-500 hover:text-teal-400 transition-colors font-medium"
          >
            {process.env.NEXT_PUBLIC_COMMIT_HASH}
          </a>
        )}
      </div>
    </footer>
  );
}

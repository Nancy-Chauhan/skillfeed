import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] relative z-10">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-mono text-sm font-semibold text-white/80">
            skillfeed<span className="text-emerald-400/70">_</span>
          </Link>
          <p className="font-mono text-[11px] text-white/60">
            &copy; {new Date().getFullYear()} skillfeed
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] relative z-10 bg-[#09090B]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 min-h-14 flex items-center py-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="font-mono text-sm font-semibold text-white/60">
            skillfeed<span className="text-violet-400/70">_</span>
          </Link>
          <p className="font-mono text-[11px] text-white/40">
            &copy; {new Date().getFullYear()} skillfeed
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] relative z-10 bg-[#09090B]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left — brand + tagline */}
          <div className="space-y-1.5">
            <Link href="/" className="font-mono text-sm font-semibold text-white/60">
              skillfeed<span className="text-violet-400/70">_</span>
            </Link>
            <p className="font-mono text-[11px] text-white/30 leading-relaxed">
              500+ newsletters distilled into your daily career brief.
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.04]">
          <p className="font-mono text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} skillfeed
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-[#00FF88]" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-white/60">SkillFeed</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-xs text-white/25 hover:text-white/50 transition-colors duration-200">
              Sign in
            </Link>
            <Link href="/login" className="text-xs text-white/25 hover:text-white/50 transition-colors duration-200">
              Get started
            </Link>
          </div>
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} SkillFeed
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-white tracking-tight">
              skillfeed<span className="text-violet-400">_</span>
            </span>
          </Link>
          {!user && (
            <nav className="hidden md:flex items-center gap-1">
              <a
                href="#features"
                className="font-mono text-[12px] text-white/45 hover:text-white/75 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-white/[0.04]"
              >
                Features
              </a>
            </nav>
          )}
        </div>
        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="font-mono text-[13px] text-white/60 hover:text-white/80 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-white/[0.05]"
              >
                dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-white/55 hover:text-white/80 hover:bg-white/[0.05] cursor-pointer h-8 text-[13px]"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  sign out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button className="rounded-md bg-violet-500 text-white hover:bg-violet-400 px-5 h-8 cursor-pointer text-xs font-medium transition-all duration-200 shadow-[0_0_16px_rgba(167,139,250,0.15)]">
                Get started
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

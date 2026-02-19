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
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-white/80 tracking-tight">
            skillfeed<span className="text-emerald-400">_</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="font-mono text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-white/[0.03]"
              >
                dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-white/20 hover:text-white/50 hover:bg-white/[0.03] cursor-pointer h-8 text-[13px]"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  sign out
                </Button>
              </form>
            </>
          ) : (
            <Link
              href="/#waitlist"
              className="font-mono text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-white/[0.03]"
            >
              join waitlist
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

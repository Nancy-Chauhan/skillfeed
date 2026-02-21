import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
      <div className="text-center space-y-4">
        <p className="font-mono text-sm text-white/40">404</p>
        <h1 className="text-lg font-semibold text-white/70">Page not found</h1>
        <Link
          href="/"
          className="inline-block font-mono text-xs text-violet-400/60 hover:text-violet-400 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
      <div className="text-center space-y-4">
        <p className="font-mono text-sm text-white/60">500</p>
        <h1 className="text-lg font-semibold text-white/80">
          Something went wrong
        </h1>
        <button
          onClick={reset}
          className="font-mono text-xs text-violet-400/60 hover:text-violet-400 transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

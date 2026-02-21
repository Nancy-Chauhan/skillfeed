export default function NewsletterLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B]">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.10]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="h-4 w-20 bg-white/[0.06] rounded animate-pulse" />
          <div className="h-4 w-16 bg-white/[0.06] rounded animate-pulse" />
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-24 pb-10 space-y-8">
        <div className="h-8 w-16 bg-white/[0.04] rounded animate-pulse" />
        <div className="space-y-3">
          <div className="h-6 w-64 bg-white/[0.06] rounded animate-pulse" />
          <div className="h-3 w-40 bg-white/[0.04] rounded animate-pulse" />
        </div>
        <div className="h-12 w-full bg-white/[0.03] rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-4 border-b border-white/[0.04] space-y-2">
              <div className="h-4 w-3/4 bg-white/[0.06] rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-5 w-16 bg-white/[0.04] rounded animate-pulse" />
              </div>
              <div className="h-3 w-full bg-white/[0.03] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

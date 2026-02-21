export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B]">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.10]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="h-4 w-20 bg-white/[0.06] rounded animate-pulse" />
          <div className="h-4 w-16 bg-white/[0.06] rounded animate-pulse" />
        </div>
      </div>

      <main className="flex-1 pt-14">
        <div className="border-b border-white/[0.04]">
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-3">
            <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
            <div className="h-7 w-56 bg-white/[0.06] rounded animate-pulse" />
            <div className="h-4 w-44 bg-white/[0.04] rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full px-6 py-10 space-y-10">
          {/* Profile skeleton */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
            <div className="h-5 w-32 bg-white/[0.06] rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Newsletter list skeleton */}
          <div className="space-y-4">
            <div className="h-5 w-28 bg-white/[0.06] rounded animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
                <div className="h-4 w-48 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-3 w-32 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 pt-16 sm:pt-20">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="h-4 w-20 bg-white/[0.06] rounded animate-pulse" />
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 space-y-6">
          <div className="h-8 w-48 bg-white/[0.06] rounded animate-pulse mx-auto" />
          <div className="h-4 w-64 bg-white/[0.04] rounded animate-pulse mx-auto" />
          <div className="h-10 w-32 bg-white/[0.06] rounded-lg animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}

const newsletters = [
  { name: "TLDR AI", domain: "tldr.tech" },
  { name: "The Batch", domain: "deeplearning.ai" },
  { name: "Ben's Bites", domain: "bensbites.co" },
  { name: "The Neuron", domain: "theneurondaily.com" },
  { name: "Import AI", domain: "importai.net" },
  { name: "Alpha Signal", domain: "alphasignal.ai" },
  { name: "Superhuman AI", domain: "superhuman.ai" },
  { name: "ByteByteGo", domain: "bytebytego.com" },
  { name: "The Pragmatic Engineer", domain: "pragmaticengineer.com" },
  { name: "AI Breakfast", domain: "aibreakfast.beehiiv.com" },
  { name: "Hacker News", domain: "news.ycombinator.com" },
  { name: "Ahead of AI", domain: "magazine.sebastianraschka.com" },
  { name: "The Algorithm", domain: "technologyreview.com" },
  { name: "Python Weekly", domain: "pythonweekly.com" },
  { name: "Changelog", domain: "changelog.com" },
  { name: "Dev.to", domain: "dev.to" },
];

export function NewsletterMarquee() {
  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden py-6">
      <p className="text-center font-mono text-[11px] text-white/45 tracking-[0.15em] uppercase mb-5">
        // newsletters we scan every morning
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 z-10 bg-gradient-to-r from-[#09090B] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 z-10 bg-gradient-to-l from-[#09090B] to-transparent pointer-events-none" />

        <div className="flex animate-marquee w-max">
          {[...newsletters, ...newsletters].map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex-shrink-0 mx-1.5 flex items-center gap-2.5 px-3.5 py-2 rounded-md border border-white/[0.1] bg-white/[0.03] font-mono text-[12px] text-white/55 whitespace-nowrap hover:border-white/[0.15] hover:text-white/80 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                alt={item.name}
                width={16}
                height={16}
                className="rounded-sm opacity-100"
              />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

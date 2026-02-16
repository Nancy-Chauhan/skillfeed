const newsletters = [
  { name: "TLDR", domain: "tldr.tech" },
  { name: "Bytes", domain: "bytes.dev" },
  { name: "Morning Brew", domain: "morningbrew.com" },
  { name: "Hacker News", domain: "news.ycombinator.com" },
  { name: "Dev.to", domain: "dev.to" },
  { name: "The Pragmatic Engineer", domain: "pragmaticengineer.com" },
  { name: "ByteByteGo", domain: "bytebytego.com" },
  { name: "Changelog", domain: "changelog.com" },
  { name: "JavaScript Weekly", domain: "javascriptweekly.com" },
  { name: "Smashing Magazine", domain: "smashingmagazine.com" },
  { name: "CSS-Tricks", domain: "css-tricks.com" },
  { name: "React Newsletter", domain: "reactnewsletter.com" },
  { name: "Node Weekly", domain: "nodeweekly.com" },
  { name: "Python Weekly", domain: "pythonweekly.com" },
];

export function NewsletterMarquee() {
  return (
    <section className="py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-5">
        <p className="text-center text-xs text-white/30 uppercase tracking-[0.2em]">
          Aggregating the best developer newsletters
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r from-[#0C0C0C] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l from-[#0C0C0C] to-transparent pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-marquee w-max">
          {[...newsletters, ...newsletters].map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex-shrink-0 mx-3 flex items-center gap-3 px-5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white/40 font-medium whitespace-nowrap hover:border-white/[0.12] hover:text-white/60 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`}
                alt={item.name}
                width={20}
                height={20}
                className="rounded"
              />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

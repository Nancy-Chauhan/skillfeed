/**
 * Email-only newsletters to manually subscribe using the AgentMail inbox.
 *
 * These newsletters don't have public RSS feeds, so you need to
 * visit each signup URL and subscribe with the AgentMail address.
 *
 * Usage:
 *   npx tsx scripts/newsletter-subscribe-list.ts
 */

const AGENTMAIL_INBOX = process.env.AGENTMAIL_INBOX ?? "perfectcar947@agentmail.to";

const newsletters = [
  // ── AI / ML Newsletters ──
  { name: "TLDR AI", url: "https://tldr.tech/ai", category: "AI" },
  { name: "TLDR", url: "https://tldr.tech", category: "AI" },
  { name: "The Batch (deeplearning.ai)", url: "https://www.deeplearning.ai/the-batch/", category: "AI" },
  { name: "Ben's Bites", url: "https://bensbites.beehiiv.com/subscribe", category: "AI" },
  { name: "The Neuron", url: "https://www.theneurondaily.com/", category: "AI" },
  { name: "Alpha Signal", url: "https://alphasignal.ai/", category: "AI" },
  { name: "Superhuman AI", url: "https://www.joinsuperhuman.ai/", category: "AI" },
  { name: "The Rundown AI", url: "https://www.therundown.ai/subscribe", category: "AI" },
  { name: "AI Tool Report", url: "https://aitoolreport.beehiiv.com/subscribe", category: "AI" },
  { name: "Mindstream AI", url: "https://www.mindstream.news/", category: "AI" },
  { name: "AI Breakfast", url: "https://aibreakfast.beehiiv.com/subscribe", category: "AI" },
  { name: "Prompts Daily", url: "https://www.promptsdaily.com/", category: "AI" },
  { name: "The AI Valley", url: "https://theaivalley.com/", category: "AI" },
  { name: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com/subscribe", category: "AI" },
  { name: "Davis Summarizes Papers", url: "https://dsummarize.substack.com/", category: "AI" },

  // ── Engineering / Dev Newsletters ──
  { name: "ByteByteGo", url: "https://blog.bytebytego.com/subscribe", category: "Engineering" },
  { name: "The Pragmatic Engineer", url: "https://www.pragmaticengineer.com/newsletter", category: "Engineering" },
  { name: "Changelog News", url: "https://changelog.com/news", category: "Engineering" },
  { name: "Console.dev", url: "https://console.dev/", category: "Engineering" },
  { name: "Quastor", url: "https://www.quastor.org/subscribe", category: "Engineering" },
  { name: "System Design Newsletter", url: "https://newsletter.systemdesign.one/", category: "Engineering" },

  // ── DevOps / Infra Newsletters ──
  { name: "DevOps Weekly", url: "https://www.devopsweekly.com/", category: "DevOps" },
  { name: "KubeWeekly", url: "https://www.cncf.io/kubeweekly/", category: "DevOps" },
  { name: "TLDR DevOps", url: "https://tldr.tech/devops", category: "DevOps" },

  // ── Security Newsletters ──
  { name: "tl;dr sec", url: "https://tldrsec.com/", category: "Security" },
  { name: "TLDR InfoSec", url: "https://tldr.tech/infosec", category: "Security" },
  { name: "This Week in Security", url: "https://this.weekinsecurity.com/", category: "Security" },

  // ── Web Dev / Frontend Newsletters ──
  { name: "JavaScript Weekly", url: "https://javascriptweekly.com/", category: "WebDev" },
  { name: "React Newsletter", url: "https://reactnewsletter.com/", category: "WebDev" },
  { name: "Node Weekly", url: "https://nodeweekly.com/", category: "WebDev" },
  { name: "Frontend Focus", url: "https://frontendfoc.us/", category: "WebDev" },
  { name: "CSS Weekly", url: "https://css-weekly.com/", category: "WebDev" },
  { name: "TLDR Web Dev", url: "https://tldr.tech/webdev", category: "WebDev" },

  // ── Data / Python Newsletters ──
  { name: "Python Weekly", url: "https://www.pythonweekly.com/", category: "Data" },
  { name: "Data Elixir", url: "https://dataelixir.com/", category: "Data" },
];

function main() {
  console.log(`\n📬 Newsletter Manual Subscribe List`);
  console.log(`   Subscribe each with: ${AGENTMAIL_INBOX}\n`);
  console.log(`   Total: ${newsletters.length} newsletters\n`);
  console.log("─".repeat(70));

  const categories = [...new Set(newsletters.map((n) => n.category))];

  for (const category of categories) {
    const items = newsletters.filter((n) => n.category === category);
    console.log(`\n  ${category} (${items.length})`);
    console.log("  " + "─".repeat(40));
    for (const nl of items) {
      console.log(`    ${nl.name}`);
      console.log(`    → ${nl.url}`);
      console.log();
    }
  }

  console.log("─".repeat(70));
  console.log(`\nSteps:`);
  console.log(`  1. Visit each URL above`);
  console.log(`  2. Enter ${AGENTMAIL_INBOX} as the email`);
  console.log(`  3. Confirm subscription via AgentMail inbox if needed`);
  console.log(`  4. Emails will auto-flow into SkillFeed via webhook\n`);
}

main();

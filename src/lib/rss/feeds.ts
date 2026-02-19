export interface RSSFeed {
  url: string;
  name: string;
}

export const RSS_FEEDS: RSSFeed[] = [
  // AI / ML: Company Blogs
  { url: "https://openai.com/news/rss.xml", name: "OpenAI Blog" },
  { url: "https://blog.google/technology/ai/rss/", name: "Google AI Blog" },
  { url: "https://deepmind.google/blog/rss.xml", name: "Google DeepMind" },
  { url: "https://research.google/blog/rss/", name: "Google Research" },
  { url: "https://ai.meta.com/blog/rss/", name: "Meta AI Blog" },
  { url: "https://engineering.fb.com/feed/", name: "Meta Engineering" },
  { url: "https://huggingface.co/blog/feed.xml", name: "Hugging Face Blog" },
  { url: "https://developer.nvidia.com/blog/feed/", name: "NVIDIA Developer Blog" },
  { url: "https://www.microsoft.com/en-us/research/blog/feed/", name: "Microsoft Research" },
  { url: "https://aws.amazon.com/blogs/machine-learning/feed/", name: "AWS ML Blog" },
  { url: "https://aws.amazon.com/blogs/ai/feed/", name: "AWS AI Blog" },
  { url: "https://stability.ai/blog?format=rss", name: "Stability AI Blog" },
  { url: "https://txt.cohere.com/rss/", name: "Cohere Blog" },

  // AI / ML: Newsletters & Independent Blogs
  { url: "https://importai.substack.com/feed", name: "Import AI (Jack Clark)" },
  { url: "https://magazine.sebastianraschka.com/feed", name: "Ahead of AI (Sebastian Raschka)" },
  { url: "https://simonwillison.net/atom/everything/", name: "Simon Willison's Weblog" },
  { url: "https://lilianweng.github.io/index.xml", name: "Lil'Log (Lilian Weng)" },
  { url: "https://colah.github.io/rss.xml", name: "colah's blog (Chris Olah)" },
  { url: "https://karpathy.bearblog.dev/feed/?type=rss", name: "Andrej Karpathy's Blog" },
  { url: "https://huyenchip.com/feed.xml", name: "Chip Huyen Blog" },
  { url: "https://jalammar.github.io/feed.xml", name: "Jay Alammar Blog" },
  { url: "https://distill.pub/rss.xml", name: "Distill.pub" },
  { url: "https://lastweekin.ai/feed", name: "Last Week in AI" },
  { url: "https://towardsdatascience.com/feed", name: "Towards Data Science" },
  { url: "https://machinelearningmastery.com/blog/feed/", name: "Machine Learning Mastery" },

  // AI / ML: Research Feeds
  { url: "https://export.arxiv.org/rss/cs.AI", name: "arXiv cs.AI" },
  { url: "https://export.arxiv.org/rss/cs.LG", name: "arXiv cs.LG (Machine Learning)" },

  // Engineering / Backend: Company Blogs
  { url: "https://netflixtechblog.com/feed", name: "Netflix Tech Blog" },
  { url: "https://eng.uber.com/feed/", name: "Uber Engineering" },
  { url: "https://stripe.com/blog/feed.rss", name: "Stripe Blog" },
  { url: "https://medium.com/feed/airbnb-engineering", name: "Airbnb Engineering" },
  { url: "https://engineering.atspotify.com/feed/", name: "Spotify Engineering" },
  { url: "https://blog.cloudflare.com/rss/", name: "Cloudflare Blog" },
  { url: "https://github.blog/engineering.atom", name: "GitHub Engineering" },
  { url: "https://engineering.linkedin.com/blog.rss.html", name: "LinkedIn Engineering" },
  { url: "https://dropbox.tech/feed", name: "Dropbox Tech Blog" },
  { url: "https://medium.com/feed/@Pinterest_Engineering", name: "Pinterest Engineering" },
  { url: "https://shopify.engineering/blog.atom", name: "Shopify Engineering" },
  { url: "https://discord.com/blog/rss.xml", name: "Discord Blog" },
  { url: "https://slack.engineering/feed/", name: "Slack Engineering" },
  { url: "https://eng.lyft.com/feed", name: "Lyft Engineering" },

  // DevOps / Infrastructure
  { url: "https://kubernetes.io/feed.xml", name: "Kubernetes Blog" },
  { url: "https://www.docker.com/blog/feed/", name: "Docker Blog" },
  { url: "https://www.cncf.io/feed/", name: "CNCF Blog" },
  { url: "https://www.hashicorp.com/blog/feed.xml", name: "HashiCorp Blog" },
  { url: "https://aws.amazon.com/blogs/devops/feed/", name: "AWS DevOps Blog" },

  // Security
  { url: "https://krebsonsecurity.com/feed/", name: "Krebs on Security" },
  { url: "https://feeds.feedburner.com/TroyHunt", name: "Troy Hunt Blog" },
  { url: "https://www.schneier.com/feed/atom/", name: "Schneier on Security" },
  { url: "https://googleprojectzero.blogspot.com/feeds/posts/default?alt=rss", name: "Google Project Zero" },
  { url: "https://msrc.microsoft.com/blog/feed/", name: "Microsoft Security Response Center" },
  { url: "https://portswigger.net/research/rss", name: "PortSwigger Research" },

  // Web Dev / Frontend
  { url: "https://www.smashingmagazine.com/feed/", name: "Smashing Magazine" },
  { url: "https://css-tricks.com/feed/", name: "CSS-Tricks" },
  { url: "https://overreacted.io/rss.xml", name: "Overreacted (Dan Abramov)" },
  { url: "https://joshwcomeau.com/rss.xml", name: "Josh W. Comeau" },
  { url: "https://kentcdodds.com/blog/rss.xml", name: "Kent C. Dodds" },
  { url: "https://vercel.com/atom", name: "Vercel Blog" },
  { url: "https://web.dev/static/blog/feed.xml", name: "web.dev (Google)" },

  // General Dev / Aggregators
  { url: "https://hnrss.org/best?count=10", name: "Hacker News Best" },
  { url: "https://dev.to/feed/tag/ai", name: "Dev.to AI" },
  { url: "https://dev.to/feed/tag/webdev", name: "Dev.to WebDev" },
  { url: "https://dev.to/feed/tag/devops", name: "Dev.to DevOps" },
  { url: "https://dev.to/feed/tag/security", name: "Dev.to Security" },
  { url: "https://dev.to/feed/tag/javascript", name: "Dev.to JavaScript" },
];

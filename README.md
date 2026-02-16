# SkillFeed

**AI-powered personalized newsletter platform for developers.**

SkillFeed aggregates 500+ developer newsletters, deduplicates content using AI, and delivers one personalized daily brief matched to your skills and career goals.

## How It Works

1. **Ingestion** — Newsletters arrive via AgentMail webhooks and RSS feeds. Claude AI categorizes each article by role, level, and keywords.
2. **Matching** — A daily cron job matches articles to each user's profile using role overlap, level compatibility, and keyword intersection.
3. **Composition** — Claude composes a personalized newsletter with featured articles, "why it matters" context, a learning roadmap, and quick reads.
4. **Delivery** — The newsletter is sent via Resend with open/click tracking and feedback collection.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI | Claude API (Anthropic SDK) |
| Email Sending | Resend + React Email |
| Email Ingestion | AgentMail + Svix webhooks |
| Styling | Tailwind CSS v4 + ShadCN UI |
| Deployment | Vercel (with cron jobs) |

## Project Structure

```
skillfeed/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── login/page.tsx            # Magic link auth
│   │   ├── onboarding/page.tsx       # Profile setup wizard
│   │   ├── dashboard/page.tsx        # User dashboard
│   │   ├── newsletters/[id]/page.tsx # View past newsletters
│   │   ├── auth/
│   │   │   ├── callback/route.ts     # OAuth callback handler
│   │   │   └── signout/route.ts      # Sign out
│   │   └── api/
│   │       ├── users/                # Profile CRUD
│   │       ├── newsletters/
│   │       │   ├── generate/         # Generate for single user
│   │       │   └── generate-all/     # Daily cron (all users)
│   │       ├── webhooks/agentmail/   # Email ingestion webhook
│   │       ├── metrics/              # Open, click, feedback tracking
│   │       └── unsubscribe/          # One-click unsubscribe
│   │
│   ├── components/
│   │   ├── landing/                  # Hero, features, how-it-works, CTA, marquee
│   │   ├── dashboard/               # Profile summary, newsletter cards
│   │   ├── onboarding/              # Multi-step profile form, role selector
│   │   ├── shared/                   # Header, footer
│   │   └── ui/                       # ShadCN components
│   │
│   ├── emails/
│   │   └── newsletter-template.tsx   # React Email template
│   │
│   ├── lib/
│   │   ├── agents/                   # Claude AI agents
│   │   │   ├── article-categorizer.ts  # Categorize articles by role/level/keywords
│   │   │   ├── newsletter-composer.ts  # Compose personalized newsletter
│   │   │   └── profile-parser.ts       # Parse resume into structured profile
│   │   ├── supabase/                 # DB clients (admin, server, browser)
│   │   ├── queue/ingestion.ts        # Async job queue with retry
│   │   ├── metrics/events.ts         # Tracking URL builder + HMAC verification
│   │   ├── claude/client.ts          # Anthropic SDK wrapper
│   │   ├── resend/client.ts          # Email client
│   │   ├── agentmail/client.ts       # Inbox client
│   │   ├── auth/session.ts           # Auth helpers
│   │   └── utils/                    # Types, constants, rate limiter, env validation
│   │
│   └── middleware.ts                 # Route protection
│
├── supabase/migrations/              # Database schema (9 migrations)
├── scripts/                          # Setup, seeding, RSS ingestion
└── vercel.json                       # Cron schedule (daily 7 AM UTC)
```

## Database Schema

```
articles          — Ingested articles with roles[], keywords[], level, processing_status
users             — Developer profiles with current/target roles, skills, learning goals
newsletters_sent  — Delivered newsletters with article_ids[], delivery_status, tracking
newsletter_events — Engagement tracking (opens, clicks, feedback)
ingestion_jobs    — Async processing queue with retry logic
```

**Key function:** `match_articles_for_user(user_id)` — PostgreSQL RPC that matches articles by role overlap, level compatibility, and keyword intersection. Returns top 15 unread articles from the last 7 days.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Supabase](https://supabase.com) project
- [Anthropic](https://console.anthropic.com) API key
- [Resend](https://resend.com) API key
- [AgentMail](https://agentmail.to) account (for email ingestion)

### Setup

1. **Clone and install**
   ```bash
   git clone git@github.com:Nancy-Chauhan/skillfeed.git
   cd skillfeed
   bun install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Fill in all values in .env.local
   ```

3. **Run database migrations**

   Execute each file in `supabase/migrations/` (001 through 009) in your Supabase SQL editor, in order.

4. **Set up AgentMail inbox** (optional, for email ingestion)
   ```bash
   bun run scripts/setup-agentmail.ts
   # Copy the output values to .env.local
   ```

5. **Seed test articles** (optional)
   ```bash
   bun run scripts/seed-test-data.ts
   ```

6. **Start dev server**
   ```bash
   bun run dev
   ```

### Ingest Articles via RSS

```bash
bun run scripts/ingest-rss.ts
```

Fetches from Hacker News, Dev.to, Google AI Blog, AWS ML Blog, and Meta Engineering.

### Send Newsletter Manually

```bash
curl -X POST http://localhost:3000/api/newsletters/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"userId":"<user-uuid>"}'
```

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/users` | Session | Create user profile |
| GET/PATCH | `/api/users/[id]` | Session | Read/update profile |
| POST | `/api/newsletters/generate` | Cron secret | Generate newsletter for one user |
| POST | `/api/newsletters/generate-all` | Cron secret | Daily cron for all users |
| POST | `/api/webhooks/agentmail` | Svix signature | Receive newsletter emails |
| GET | `/api/metrics/open` | Signed URL | Track email opens |
| GET | `/api/metrics/click` | Signed URL | Track article clicks |
| GET | `/api/metrics/feedback` | Signed URL | Collect feedback |
| GET | `/api/unsubscribe` | JWT token | One-click unsubscribe |

## Deployment

Designed for **Vercel** with a daily cron job at 7 AM UTC (`vercel.json`).

Required environment variables on Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM`
- `AGENTMAIL_API_KEY`, `AGENTMAIL_WEBHOOK_SECRET`
- `CRON_SECRET`, `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`

## License

Private project.

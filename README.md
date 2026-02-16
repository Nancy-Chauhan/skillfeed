<p align="center">
  <h1 align="center">SkillFeed</h1>
  <p align="center">
    Stop reading 500 duplicate articles. Read the one that matters.
    <br />
    <br />
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://docs.anthropic.com"><img src="https://img.shields.io/badge/Claude_AI-Anthropic-D4A574?logo=anthropic&logoColor=white" alt="Claude AI" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-Runtime-F9F1E1?logo=bun&logoColor=black" alt="Bun" /></a>
    <br />
    <br />
    <a href="#getting-started"><strong>Get Started</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="#architecture"><strong>Architecture</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="#api-reference"><strong>API Reference</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="#deployment"><strong>Deploy</strong></a>
  </p>
</p>

<br />

## About

SkillFeed is an AI-powered newsletter aggregator that delivers **one personalized daily brief** to developers. It ingests content from 500+ newsletters, deduplicates articles using Claude AI, and matches them to each user's skills, role, and career goals.

### Key Features

- **AI-Powered Curation** &mdash; Claude categorizes articles by role, level, and keywords, then composes personalized newsletters with "why it matters" context
- **Smart Matching** &mdash; PostgreSQL RPC function matches articles using role overlap, level compatibility, and keyword intersection
- **Multi-Source Ingestion** &mdash; Pulls from RSS feeds and email newsletters via AgentMail webhooks
- **Engagement Tracking** &mdash; Open rates, click tracking, and per-article feedback (helpful / not helpful)
- **One-Click Unsubscribe** &mdash; JWT-based unsubscribe with `List-Unsubscribe` header support

### Built With

- [Next.js 16](https://nextjs.org) &mdash; App Router, React 19, Server Components
- [Supabase](https://supabase.com) &mdash; PostgreSQL, Auth, Row Level Security
- [Claude API](https://docs.anthropic.com) &mdash; Article categorization, profile parsing, newsletter composition
- [Resend](https://resend.com) + [React Email](https://react.email) &mdash; Transactional email delivery
- [AgentMail](https://agentmail.to) &mdash; Email ingestion with Svix webhook verification
- [Tailwind CSS v4](https://tailwindcss.com) + [ShadCN UI](https://ui.shadcn.com) &mdash; Component library
- [Bun](https://bun.sh) &mdash; Runtime and package manager

<br />

## Architecture

```
                     ┌──────────────┐
                     │  RSS Feeds   │
                     │  (5 sources) │
                     └──────┬───────┘
                            │
                            ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  AgentMail   │───▶│  Ingestion   │───▶│  Claude AI       │
│  (webhooks)  │    │  Queue       │    │  Categorizer     │
└──────────────┘    └──────┬───────┘    └────────┬─────────┘
                           │                     │
                           ▼                     ▼
                    ┌─────────────────────────────────┐
                    │         Supabase (PostgreSQL)    │
                    │  articles │ users │ newsletters  │
                    └────────────────┬────────────────-┘
                                     │
                              ┌──────┴──────┐
                              │  Daily Cron │
                              │  (7 AM UTC) │
                              └──────┬──────┘
                                     │
                    ┌────────────────-┼────────────────-┐
                    ▼                ▼                  ▼
             ┌────────────┐  ┌────────────┐  ┌──────────────┐
             │  Match     │  │  Compose   │  │  Send via    │
             │  Articles  │  │  with AI   │  │  Resend      │
             └────────────┘  └────────────┘  └──────┬───────┘
                                                    │
                                                    ▼
                                             ┌────────────┐
                                             │  Developer  │
                                             │  Inbox      │
                                             └────────────┘
```

### Data Flow

1. **Ingest** &mdash; Newsletter emails arrive via AgentMail webhooks (Svix-verified) or RSS script. Articles enter an async queue with exponential backoff retry.
2. **Categorize** &mdash; Claude AI extracts title, summary, level, roles, keywords, and URL from each article.
3. **Match** &mdash; The `match_articles_for_user()` PostgreSQL function finds the top 15 unread articles from the last 7 days matching each user's profile.
4. **Compose** &mdash; Claude generates a personalized newsletter: featured articles with "why it matters", a learning roadmap, and quick reads.
5. **Deliver** &mdash; Resend sends the email with HMAC-signed tracking pixels, click tracking, and feedback URLs.

<br />

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Landing page
│   ├── login/                        # Magic link authentication
│   ├── onboarding/                   # Multi-step profile setup
│   ├── dashboard/                    # User dashboard
│   ├── newsletters/[id]/            # View past newsletters
│   ├── auth/                         # Callback + sign out routes
│   └── api/
│       ├── users/                    # Profile CRUD (POST, GET, PATCH)
│       ├── newsletters/generate/     # Single user newsletter generation
│       ├── newsletters/generate-all/ # Daily cron job
│       ├── webhooks/agentmail/       # Email ingestion endpoint
│       ├── metrics/                  # Open, click, feedback tracking
│       └── unsubscribe/              # JWT-based one-click unsubscribe
│
├── components/
│   ├── landing/                      # Hero, features, how-it-works, CTA, marquee
│   ├── dashboard/                    # Profile summary, newsletter cards/list
│   ├── onboarding/                   # Profile form, role selector
│   ├── shared/                       # Header, footer
│   └── ui/                           # ShadCN primitives
│
├── emails/
│   └── newsletter-template.tsx       # React Email template
│
├── lib/
│   ├── agents/                       # AI agents
│   │   ├── article-categorizer.ts    # Article → structured data
│   │   ├── newsletter-composer.ts    # Articles + profile → newsletter
│   │   └── profile-parser.ts         # Resume → structured profile
│   ├── supabase/                     # Admin, server, browser clients
│   ├── queue/                        # Async ingestion with retry
│   ├── metrics/                      # HMAC-signed tracking URLs
│   ├── auth/                         # Session helpers
│   └── utils/                        # Types, constants, rate limiter
│
└── middleware.ts                     # Route protection

supabase/migrations/                  # 9 sequential SQL migrations
scripts/                              # setup-agentmail, seed-data, ingest-rss
```

<br />

## Database Schema

| Table | Purpose |
|-------|---------|
| `articles` | Ingested articles with `roles[]`, `keywords[]`, `level`, `processing_status` |
| `users` | Developer profiles with current/target roles, skills, learning goals |
| `newsletters_sent` | Delivered newsletters with `article_ids[]`, delivery status, HTML content |
| `newsletter_events` | Engagement tracking: opens, clicks, feedback per article |
| `ingestion_jobs` | Async processing queue with retry logic (max 5 attempts) |

**Key RPC:** `match_articles_for_user(user_id)` returns the top 15 matching unread articles from the last 7 days, scored by keyword overlap, filtered by role and level compatibility.

<br />

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Supabase](https://supabase.com) project (free tier works)
- [Anthropic](https://console.anthropic.com) API key
- [Resend](https://resend.com) API key
- [AgentMail](https://agentmail.to) account (optional, for email ingestion)

### Installation

```bash
# Clone the repository
git clone git@github.com:Nancy-Chauhan/skillfeed.git
cd skillfeed

# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
```

Fill in `.env.local` with your API keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
AGENTMAIL_API_KEY=...
AGENTMAIL_WEBHOOK_SECRET=...
CRON_SECRET=...          # Random string for cron auth
JWT_SECRET=...           # Random string for unsubscribe tokens
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the migrations in order in your Supabase SQL editor:

```bash
supabase/migrations/001_enable_extensions.sql    # pgcrypto
supabase/migrations/002_create_articles.sql      # Articles table + enums
supabase/migrations/003_create_users.sql         # Users table
supabase/migrations/004_create_newsletters.sql   # Newsletters sent
supabase/migrations/005_create_functions.sql     # match_articles_for_user()
supabase/migrations/006_create_indexes.sql       # GIN + B-tree indexes
supabase/migrations/007_enable_rls.sql           # Row Level Security policies
supabase/migrations/008_create_ingestion_jobs.sql # Async queue
supabase/migrations/009_create_newsletter_events.sql # Engagement tracking
```

### Run

```bash
# Start development server
bun run dev

# Seed test articles (optional)
bun run scripts/seed-test-data.ts

# Ingest from RSS feeds
bun run scripts/ingest-rss.ts

# Set up AgentMail inbox (optional)
bun run scripts/setup-agentmail.ts
```

<br />

## API Reference

### Newsletter Generation

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/newsletters/generate` | `Bearer CRON_SECRET` | Generate and send newsletter for a single user |
| `POST` | `/api/newsletters/generate-all` | `Bearer CRON_SECRET` | Daily cron: process all eligible users |

```bash
# Send newsletter to a specific user
curl -X POST http://localhost:3000/api/newsletters/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"userId": "<uuid>"}'
```

### User Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users` | Session | Create profile (triggers AI parsing) |
| `GET` | `/api/users/[id]` | Session | Get user profile |
| `PATCH` | `/api/users/[id]` | Session | Update profile (re-parses if resume changes) |

### Webhooks & Tracking

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/webhooks/agentmail` | Svix signature | Receive inbound newsletter emails |
| `GET` | `/api/metrics/open` | HMAC | 1x1 tracking pixel for email opens |
| `GET` | `/api/metrics/click` | HMAC | Click tracking with redirect |
| `GET` | `/api/metrics/feedback` | HMAC | Per-article helpful/not helpful |
| `GET` | `/api/unsubscribe` | JWT | One-click unsubscribe |

<br />

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy &mdash; the cron job runs daily at 7 AM UTC via `vercel.json`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `ANTHROPIC_API_KEY` | Claude API key |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `EMAIL_FROM` | Sender address (e.g. `SkillFeed <hello@skillfeed.dev>`) |
| `AGENTMAIL_API_KEY` | AgentMail API key |
| `AGENTMAIL_WEBHOOK_SECRET` | Svix webhook verification secret |
| `CRON_SECRET` | Bearer token for cron job authentication |
| `JWT_SECRET` | Secret for signing unsubscribe tokens |
| `NEXT_PUBLIC_APP_URL` | Public app URL for tracking links |

<br />

## License

This project is proprietary and not open for redistribution.

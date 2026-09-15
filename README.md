# The Ledger — Poker Journal

A poker session tracker that goes beyond a bankroll spreadsheet: log each
session, get asked a short set of reflection questions right after (mental
game, what worked, the leak, one action step), and see analysis of which
leaks are actually costing you money over time.

React + Vite frontend, [Supabase](https://supabase.com) (Postgres + Auth)
for the database, so your sessions sync across devices and each user has
their own private account.

## Features

- **Session log** — date, location, cash/tournament, variant, stakes,
  buy-in/cash-out (auto-computes result), duration.
- **Post-session reflection wizard** — a short, skippable flow after saving
  a session: rate your mental game, note what worked, name a leak (tagged
  from a fixed taxonomy or your own custom tag), one action step for next
  time, and any reads on opponents.
- **Overview** — net result, win rate, bankroll-over-time and by-month
  charts, breakdown by location.
- **Analysis** — leak frequency and average $ impact per tag, mental-game
  rating vs. result, and a running list of your recent action items.
- **Accounts** — email/password auth; Postgres row-level security means you
  only ever see your own sessions.
- **One-time import** — if this browser has old data from the original
  single-device version of the app, you'll be offered a one-click import
  into your account on first sign-in.
- **Bulk import from a spreadsheet** — upload a `.xlsx`, `.xls`, or `.csv`
  file from the Session log tab. Columns are auto-mapped by header name
  (Date, Location, Result, Buy-in, Cash-out, Game, Notes, …) with a review
  step before anything is imported; a result can also be computed from
  buy-in/cash-out if no result column exists.

## Project layout

```
poker-ledger/
├── index.html, vite.config.js, package.json
├── supabase/schema.sql       run this once in the Supabase SQL editor
├── .env.example               copy to .env.local and fill in your project
└── src/
    ├── main.jsx, App.jsx
    ├── lib/                   supabaseClient, sessions CRUD, stats/leak analytics, leak taxonomy
    ├── contexts/AuthContext.jsx
    └── components/
        ├── auth/              sign in / create account
        ├── layout/             header, tabs, chip logo
        ├── overview/           hero stats + charts
        ├── sessions/           session list, add/edit form, import banner
        ├── reflection/         the post-session wizard
        └── analysis/           leak board, mental-game chart, action items
```

## Setup

### 1. Install Node.js and project dependencies

You need Node 18+ installed. Then:

```bash
npm install
```

### 2. Create a Supabase project

1. Go to **[supabase.com/dashboard](https://supabase.com/dashboard)** and
   sign up / log in (free tier is enough).
2. Create a new project (pick any name/region; set a database password —
   you won't need it day to day).
3. Once it's ready, open **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key
4. Open the **SQL Editor**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `sessions` table with row-level security so each user only sees their own
   rows.
5. By default Supabase requires email confirmation for new accounts. For
   quick personal use you can turn this off under **Authentication →
   Providers → Email → Confirm email**, or just click the confirmation link
   Supabase emails you after signing up.

### 3. Configure the app

```bash
cp .env.example .env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values
from step 2. The anon key is safe to ship in the frontend — it's the RLS
policies in `schema.sql` that actually keep everyone's data private.

### 4. Run it

```bash
npm run dev
```

Open the printed `localhost` URL, create an account, and start logging
sessions.

## Building for production / deploying

```bash
npm run build
```

This outputs a static `dist/` folder. Deploy it anywhere that serves static
files — **Netlify**, **Vercel**, **Cloudflare Pages**, or **GitHub Pages**
all work. On Netlify/Vercel, connect the GitHub repo and set:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same
  values as your `.env.local`)

so the platform builds it in the cloud — your own machine doesn't need
Node.js installed just to deploy.

## Roadmap (not built yet)

Goals/streaks, CSV export, an opponent/villain database, Google OAuth sign-in,
offline/PWA support, and public read-only share links. The schema and data
layer (`src/lib/`) are structured so these can be added without a rewrite.

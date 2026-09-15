# Requirements & feature log

Living record of what this app does and why, for grounding future work —
check here before assuming something isn't built, and add to it when
something new ships. Companion to [CLAUDE.md](CLAUDE.md) (how to work in
this repo) and [README.md](README.md) (user-facing setup/usage docs).

## Product goal

Go-to personal poker app: log sessions, get prompted with structured
post-session reflection questions that surface leaks, record full hand
histories, and see analysis of where to improve — multi-user, so it can be
shared with friends and each person's data stays private.

## Completed features

### Accounts & data
- Email/password auth via Supabase Auth (email confirmation required by
  default). `src/contexts/AuthContext.jsx`, `src/components/auth/`.
- Postgres row-level security on every table: a user only ever sees their
  own rows (`auth.uid() = user_id` on select/insert/update/delete).
  `supabase/schema.sql`.
- One-time import of the old single-device app's `localStorage` data on
  first sign-in, if present. `src/lib/localImport.js`.
- Bulk import from a `.xlsx` / `.xls` / `.csv` file: header-based column
  auto-mapping with a review/preview step before import; computes result
  from buy-in/cash-out if there's no result column. `src/lib/sheetImport.js`,
  `src/components/sessions/ImportSheetModal.jsx`. Uses SheetJS installed
  from `cdn.sheetjs.com` (not the npm registry build, which has an
  unpatched advisory) and is lazy-loaded so it doesn't bloat the main
  bundle.

### Session logging & reflection
- Session log: date, location, cash/tournament, variant, stakes,
  buy-in/cash-out (auto-computes result), table size, duration.
  `sessions` table, `src/components/sessions/`.
- Post-session reflection wizard, skippable: mental-game rating (1–5),
  what went well, the leak (free text + tag from a fixed taxonomy or a
  custom tag), one action step for next time, notes on opponents.
  `src/components/reflection/ReflectionWizard.jsx`, taxonomy in
  `src/lib/leakTags.js` (shared with hand tags).

### Overview & analytics
- Robinhood-style interactive bankroll chart: big number + colored
  $-delta for a selected range (1M/3M/6M/YTD/1Y/ALL), gradient line
  colored by period direction, drag/hover-to-scrub with a crosshair that
  live-updates the header to any session's date/value. Charted per
  session (not per month) for real granularity.
  `src/components/overview/RobinhoodChart.jsx`, `src/lib/timeSeries.js`.
  Deliberately shows only a $ delta, no %: a poker bankroll has no fixed
  "principal" to compute a percentage against, and an early version
  produced misleading numbers (e.g. -106%).
- Stat grid: win rate, average session, best/toughest month, best/worst
  single session. Result-by-month bar chart. Breakdown by location.
  `src/components/overview/`.
- Leak analysis tab: frequency and average $ impact per tag, mental-game
  rating vs. result, running list of recent action items.
  `src/components/analysis/`.

### Hand histories
- Full hand history logging against a session: table size (2–10max, auto
  -generates standard position names), blinds, effective stack, hero
  position and hole cards (visual 52-card picker), street-by-street action.
  `hands` table (JSONB `seats`/`board`/`actions` — this data is only ever
  read/written whole, so JSONB keeps the schema simple), `src/lib/hands.js`,
  `src/components/hands/HandForm.jsx`.
- Per-street action rows: every player still in the hand gets its own row
  with its own fold/check/call/bet/raise/all-in + amount controls (not a
  shared seat dropdown — that was tried first and was confusing). Rows
  narrow automatically street to street: **preflop → flop requires an
  explicit non-fold action** to carry forward (a seat you never gave an
  action to wasn't part of the pot); **flop → turn and turn → river only
  drop a seat on an explicit fold** (a not-yet-logged check shouldn't lock
  you out of the next street). See `activeSeatsAtStreet` in
  `src/lib/handEngine.js` — this asymmetry is intentional, don't
  "simplify" it back to one rule for all streets.
- Visual oval poker table (seats positioned around it, hero always at the
  bottom, stacks, hero's cards, the board) that updates live while
  building a hand and reveals streets progressively.
  `src/components/hands/PokerTable.jsx`, `src/lib/positions.js`.
- Pot size per street computed automatically from logged actions
  (`potByStreet` in `handEngine.js`) — an action's `amount` is the total
  chips that action puts in, not an increment.
- Saved-hand replayer: Preflop/Flop/Turn/River tabs step through the
  board/table/action log at that point. `src/components/hands/HandReplayer.jsx`.
- Hands share the same leak-tag taxonomy as session reflections.

### Distribution
- Installable as a home-screen PWA (manifest, iOS/Android meta tags,
  generated app icons, safe-area CSS for the iOS notch/home indicator) —
  no App Store or Apple Developer account needed. `public/manifest.webmanifest`,
  `index.html`.
- Deployed to Netlify (`poker-the-ledger`, site id
  `313ab4d7-e3ec-413b-b573-8c69f1cf5ca9`) at
  **https://poker-the-ledger.netlify.app**.

## Explicit decisions worth knowing

- **JSONB over normalized tables for hand seats/actions/board** — this
  data is nested, ordered, and always read/written as a whole; normalizing
  it would add joins with no real querying benefit at this scale.
- **Tab state via `useState`, no router** — the app has no distinct pages
  /deep links today, so a router would be pure overhead. Revisit if
  sharing a specific hand/session via URL becomes a requirement.
- **Manual Netlify deploys, not GitHub-linked CI builds** — see
  [CLAUDE.md](CLAUDE.md) for the deploy command. Could switch to
  auto-deploy-on-push later via the Netlify dashboard.
- **Email confirmation left ON** for new signups (Supabase default) —
  more friction for friends testing the app, but safer than off for a
  multi-user app. Toggle in Supabase Auth settings if it becomes annoying.

## Roadmap (not built yet)

Goals/streaks, CSV export, an opponent/villain database, Google OAuth
sign-in, public read-only share links, push notifications (would need the
Capacitor/TestFlight native-wrapper path, not just the PWA — see chat
history), code-splitting the JS bundle (currently one big chunk plus the
lazy-loaded xlsx chunk — fine for personal/friends use, would matter at
real scale), an automated test suite (everything so far has been verified
by hand against a live disposable Supabase account — see CLAUDE.md).

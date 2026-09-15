# CLAUDE.md

Operational reference for working on this repo. For what's been built and
why, see [REQUIREMENTS.md](REQUIREMENTS.md) — check it before assuming a
feature doesn't exist. For user-facing setup/usage, see
[README.md](README.md).

## Stack

React 19 + Vite (no router — tabs are `useState` in `App.jsx`, there's no
per-page URL). Supabase (Postgres + Auth) for the backend. Chart.js
(`chart.js/auto`) for all charts, used imperatively via a canvas ref +
`useEffect`, not a React wrapper library. SheetJS (`xlsx`) for spreadsheet
import, lazy-loaded. Plain CSS in one file (`src/styles/index.css`,
`pl-` prefixed classes, CSS custom properties for the felt-green/gold
theme) — no CSS framework. `oxlint` for linting (not eslint).

## Commands

```bash
npm install
npm run dev      # localhost:5173
npm run build    # -> dist/
npm run lint     # oxlint
```

No test suite exists (`npm test` isn't set up) — see **Verification
methodology** below for how changes have actually been checked so far.

If a fresh machine doesn't have Node: this repo's dev environment didn't
either, originally. `nvm` was installed (`~/.nvm`, sourced from `~/.zshrc`)
and Node 24 LTS installed through it — check for that before assuming
Node needs installing from scratch.

## Supabase

- Project ref: `tewttcfgqrejrimtmkkx` (project name `poker-ledger`, org
  `AdityaVetukuri's Org`), region `us-east-1`.
- Schema lives in `supabase/schema.sql` — additive/idempotent (`create
  table if not exists`, `drop policy if exists` + recreate), meant to be
  safe to re-run in full. There is no migration tool wired up; a schema
  change means editing that file **and** applying it.
- To apply a schema change without the user pasting SQL by hand: the
  Supabase Management API (`https://api.supabase.com/v1/projects/<ref>/database/query`,
  POST `{"query": "..."}`) works with a **Management API access token**
  (starts `sbp_...`) that the user generates from
  supabase.com/dashboard → account settings → Access Tokens, and pastes
  into chat. This token is not stored anywhere in the repo or persisted
  by Claude between sessions — it has to be asked for again each time
  it's needed. Never write it to a file that could be committed.
- The `service_role` key (bypasses RLS) is only used transiently in Bash
  commands for admin tasks (creating/deleting test accounts via the Auth
  Admin API — see below); never put it in `.env.local`,
  `VITE_SUPABASE_ANON_KEY`, or anything shipped to the frontend. Only the
  `anon` key belongs there — that one's meant to be public, RLS is what
  actually protects data.
- `.env.local` (gitignored) holds `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` for local dev — copy `.env.example`.

## Deployment

Netlify site `poker-the-ledger`, site id
`313ab4d7-e3ec-413b-b573-8c69f1cf5ca9`, live at
https://poker-the-ledger.netlify.app. **Not** GitHub-linked — deploys are
a manual local build + push:

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist --site 313ab4d7-e3ec-413b-b573-8c69f1cf5ca9
```

Needs `NETLIFY_AUTH_TOKEN` in the environment (a Netlify personal access
token, same "ask the user, don't persist it" handling as the Supabase
token) or a prior `netlify login`. The Supabase env vars are already set
on the Netlify site itself (`netlify env:set`), so a change to
`.env.local` should also be pushed to Netlify's env if it needs to affect
the deployed build.

**A code change is not live until this deploy step runs** — pushing to
GitHub alone does not update the live site.

## Verification methodology

There's no automated test suite, so every feature built so far has been
verified by hand, live, against the real Supabase project — this is the
pattern to keep using:

1. Create a **disposable test account** via the Auth Admin API (needs the
   `service_role` key), pre-confirmed so no email round-trip is needed:
   ```bash
   curl -X POST "https://tewttcfgqrejrimtmkkx.supabase.co/auth/v1/admin/users" \
     -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"<user>+qaN@gmail.com","password":"...","email_confirm":true}'
   ```
   (Increment the `+qaN` suffix each time rather than reusing one, to
   avoid colliding with a not-yet-cleaned-up prior run.)
2. Seed whatever rows the test needs directly via the Management API
   `database/query` endpoint (faster than driving the UI for setup data).
3. Drive the actual app in the Browser pane — sign in, exercise the real
   feature through the real UI (`javascript_tool`/`computer` against
   `localhost:5173` or the production URL). Prefer real interaction; when
   scripting clicks, **await between them** — firing several synchronous
   clicks against React state in one tick reads stale closures and
   produces confusing false failures (this bit twice this project: once
   selecting cards across every open `CardPicker` at once because
   `document.querySelectorAll` wasn't scoped to the one picker, once from
   not awaiting a re-render between two flop-card clicks).
4. Cross-check the result against the database directly via
   `database/query` (don't just trust what the UI shows).
5. **Delete the test account** via the Admin API afterward (`DELETE
   /auth/v1/admin/users/<id>`) — cascades to its sessions/hands via FK.
   Always re-check row counts belong to the real account before deleting
   anything found in the database — a hand with an empty `actions` array
   turned out to be the real user's own in-progress work, not test
   debris, and was correctly left alone.

Never run destructive test setup/teardown against the user's real
account. The real account's data (as of this writing: 87 sessions, a
couple of hands) is the actual product, not fixture data.

## Conventions worth preserving

- `src/lib/` is pure functions + Supabase calls, no React — components
  import from it, not the other way around.
- Hand `actions[].amount` is **total chips that action puts in**, not an
  increment (so a raise's amount is the new total, not "+X over the
  call"). Documented in the action-entry UI; don't change the convention
  without updating that copy too.
- `activeSeatsAtStreet` (`src/lib/handEngine.js`) is intentionally
  asymmetric: preflop→flop requires an explicit non-fold action to carry a
  seat forward, flop→turn and turn→river only exclude on an explicit
  fold. See REQUIREMENTS.md's Hand histories section for why — this was
  tuned twice against real user feedback and reverting to one uniform
  rule (either direction) reintroduces a bug that's already been fixed
  once.
- Leak tags (`src/lib/leakTags.js`) are shared between session reflections
  and hands — add a new tag there once, not in two places.

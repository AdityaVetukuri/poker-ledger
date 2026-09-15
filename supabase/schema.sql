-- The Ledger — schema for the `sessions` table.
-- Paste this whole file into the Supabase SQL editor (Project -> SQL Editor
-- -> New query) and run it once. Safe to re-run: guarded with `if not exists`
-- / `drop policy if exists` where practical.

create extension if not exists "pgcrypto";

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  played_on date not null,
  location text not null,
  game_type text not null default 'cash' check (game_type in ('cash', 'tournament')),
  variant text,                 -- e.g. "NLH", "PLO", "PLO5", "Mixed"
  stakes text,                  -- e.g. "1/2", "1/3", "$150 MTT"
  table_size int,
  buy_in numeric,
  cash_out numeric,
  amount numeric not null,      -- session result in dollars; source of truth
  duration_minutes int,

  mood_rating int check (mood_rating between 1 and 5),
  tilt_rating int check (tilt_rating between 1 and 5),

  notes_good text,
  notes_leak text,
  notes_action text,
  notes_villains text,
  tags text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: every user can only see/change their own rows.
alter table public.sessions enable row level security;

drop policy if exists "select own sessions" on public.sessions;
create policy "select own sessions" on public.sessions
  for select using (auth.uid() = user_id);

drop policy if exists "insert own sessions" on public.sessions;
create policy "insert own sessions" on public.sessions
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own sessions" on public.sessions;
create policy "update own sessions" on public.sessions
  for update using (auth.uid() = user_id);

drop policy if exists "delete own sessions" on public.sessions;
create policy "delete own sessions" on public.sessions
  for delete using (auth.uid() = user_id);

create index if not exists sessions_user_played_idx
  on public.sessions (user_id, played_on desc);
create index if not exists sessions_tags_idx
  on public.sessions using gin (tags);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- hands: one row per logged hand history, optionally linked to a session.
-- Seats, board, and the street-by-street action log are stored as JSONB
-- rather than normalized tables — this data is inherently nested/ordered
-- and only ever read/written whole (never queried column-by-column), so
-- JSONB keeps the schema simple while staying fully expressive:
--   seats:   [{ seat, position, stack, is_hero, cards: [c1,c2]|null }]
--   board:   { flop: [c1,c2,c3]|null, turn: c|null, river: c|null }
--   actions: [{ street, seat, action, amount, order }]
-- Card notation: rank+suit, e.g. "Ah", "Td", "2c" (suits: s h d c).
-- ---------------------------------------------------------------------
create table if not exists public.hands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete set null,

  title text,
  variant text not null default 'NLH',
  table_size int not null default 9,
  small_blind numeric,
  big_blind numeric,
  effective_stack_bb numeric,

  hero_seat int not null default 1,
  seats jsonb not null default '[]',
  board jsonb not null default '{}',
  actions jsonb not null default '[]',

  result numeric,
  notes text,
  tags text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hands enable row level security;

drop policy if exists "select own hands" on public.hands;
create policy "select own hands" on public.hands
  for select using (auth.uid() = user_id);

drop policy if exists "insert own hands" on public.hands;
create policy "insert own hands" on public.hands
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own hands" on public.hands;
create policy "update own hands" on public.hands
  for update using (auth.uid() = user_id);

drop policy if exists "delete own hands" on public.hands;
create policy "delete own hands" on public.hands
  for delete using (auth.uid() = user_id);

create index if not exists hands_user_created_idx
  on public.hands (user_id, created_at desc);
create index if not exists hands_session_idx
  on public.hands (session_id);
create index if not exists hands_tags_idx
  on public.hands using gin (tags);

drop trigger if exists hands_set_updated_at on public.hands;
create trigger hands_set_updated_at
  before update on public.hands
  for each row execute function public.set_updated_at();

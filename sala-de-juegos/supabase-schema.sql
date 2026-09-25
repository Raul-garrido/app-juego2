-- Run this once in the Supabase project's SQL Editor.
-- Safe to run more than once (won't error if you already ran an earlier
-- version of this file) - useful if you're not sure what you already ran.
-- Public, anonymous read/write: fine for a casual shared leaderboard,
-- not meant to resist a malicious player.

create table if not exists scores (
  id text primary key,
  player text not null,
  player_slug text not null,
  game text not null,
  game_title text not null,
  level text not null,
  time_seconds numeric not null,
  stars integer not null,
  attempts integer not null default 1,
  last_time_seconds numeric,
  last_stars integer,
  updated_at timestamptz not null default now()
);

alter table scores enable row level security;

drop policy if exists "public read" on scores;
create policy "public read" on scores for select using (true);

drop policy if exists "public insert" on scores;
create policy "public insert" on scores for insert with check (true);

drop policy if exists "public update" on scores;
create policy "public update" on scores for update using (true) with check (true);

-- Needed for the leaderboard to update live on everyone's screen without a
-- reload (Supabase Realtime only streams tables you explicitly publish).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'scores'
  ) then
    alter publication supabase_realtime add table scores;
  end if;
end $$;

-- Player profiles: name + optional photo + doll body style, keyed by the
-- same player_slug used in scores. The photo is stored as a small
-- compressed data URL (resized client-side before upload), not a file -
-- simplest option, no separate Storage bucket/policies to set up.
create table if not exists players (
  id text primary key,
  player text not null,
  photo text,
  gender text,
  updated_at timestamptz not null default now()
);

alter table players enable row level security;

drop policy if exists "public read players" on players;
create policy "public read players" on players for select using (true);

drop policy if exists "public insert players" on players;
create policy "public insert players" on players for insert with check (true);

drop policy if exists "public update players" on players;
create policy "public update players" on players for update using (true) with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'players'
  ) then
    alter publication supabase_realtime add table players;
  end if;
end $$;

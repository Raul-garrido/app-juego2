-- Run this once in the Supabase project's SQL Editor.
-- Public, anonymous read/write: fine for a casual shared leaderboard,
-- not meant to resist a malicious player.

create table scores (
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

create policy "public read" on scores for select using (true);
create policy "public insert" on scores for insert with check (true);
create policy "public update" on scores for update using (true) with check (true);

-- Calendars and busy blocks: each user's busy times, which group availability is computed from.
--
-- A calendar is one source of busy times for one user: their manual calendar today, and
-- connected Google / Outlook calendars later. Blocks belong to a calendar rather than directly
-- to a user so that per-connection data (sync tokens, last sync time) has a home, and so that
-- disconnecting or re-syncing one source touches only that source's blocks.

-- calendars table

create type public.calendar_source as enum ('manual', 'google', 'outlook');

create table public.calendars (
  id uuid primary key default gen_random_uuid(),
  -- Deleting a profile deletes its calendars (and, through busy_blocks' cascade, their blocks).
  user_id uuid not null references public.profiles(id) on delete cascade,
  source public.calendar_source not null default 'manual',
  created_at timestamptz not null default now(),
  -- At most one calendar per source per user. This also lets the API "get or create" the
  -- manual calendar with insert ... on conflict (user_id, source) do nothing.
  constraint calendars_user_source_key unique (user_id, source)
);

-- busy blocks table

-- One row is either a one-off block (repeat_days is null: busy on start_date) or a weekly block
-- (busy on each of repeat_days, from start_date until end_date, or forever if end_date is null).
-- Times are local clock times in `timezone`, so "10 AM" stays 10 AM across daylight saving.
create table public.busy_blocks (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  start_date date not null,
  end_date date,
  start_time time not null,
  end_time time not null,
  repeat_days smallint[],
  timezone text not null,
  created_at timestamptz not null default now(),

  -- No overnight blocks for now: a block ends later on the same day it starts.
  constraint busy_blocks_time_order_check check (end_time > start_time),
  -- Weekly blocks list at least one day, and only real weekdays (0 = Sunday ... 6 = Saturday).
  constraint busy_blocks_repeat_days_check
    check (cardinality(repeat_days) > 0 and repeat_days <@ '{0,1,2,3,4,5,6}'::smallint[]),
  -- An end date only makes sense on weekly blocks.
  constraint busy_blocks_one_off_no_end_check check (repeat_days is not null or end_date is null),
  -- A weekly block can't end before it starts.
  constraint busy_blocks_date_order_check check (end_date >= start_date)
);

-- Postgres doesn't index foreign key columns automatically; every "this calendar's blocks"
-- query and every re-sync filters on calendar_id.
create index busy_blocks_calendar_id_idx on public.busy_blocks (calendar_id);

-- rls

-- Both tables are served only by the API, which connects as the table owner and so bypasses RLS
-- (it scopes queries by the caller's id itself). Enabling RLS with no policies denies anon and
-- authenticated completely, so PostgREST (/rest/v1/calendars, /rest/v1/busy_blocks) can't read
-- or write them. This matches the other API-only tables.
alter table public.calendars enable row level security;
alter table public.busy_blocks enable row level security;

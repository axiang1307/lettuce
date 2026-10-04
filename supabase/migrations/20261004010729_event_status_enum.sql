-- Event lifecycle is now planning → upcoming → in_progress → done (replaces the old
-- draft/planning/confirmed/cancelled CHECK list). An enum rather than a CHECK
-- constraint so `supabase gen types` emits a union type for events.status.
-- The table had no rows when this ran, so no existing values need mapping.

create type public.event_status as enum ('planning', 'upcoming', 'in_progress', 'done');

alter table public.events drop constraint events_status_check;
alter table public.events alter column status drop default;
alter table public.events
  alter column status type public.event_status using status::public.event_status;
alter table public.events alter column status set default 'planning';

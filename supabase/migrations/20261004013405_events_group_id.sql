-- Events live inside exactly one group (group-first), so the relationship is one-to-many:
-- a group_id column on events replaces the many-to-many event_groups link table.
-- No ON DELETE clause yet (defaults to NO ACTION, i.e. a group with events can't be
-- deleted); cascade vs restrict is still an open decision.
-- events and event_groups had no rows when this ran.

alter table public.events
  add column group_id uuid not null references public.groups(id);

-- Postgres doesn't index foreign key columns automatically; "events in this group" filters on it.
create index events_group_id_idx on public.events (group_id);

drop table public.event_groups;

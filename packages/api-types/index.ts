// API contract types, derived from the Supabase-generated schema in ./database.ts
// (regenerate with `npm run gen:types` from the repo root). Row aliases follow the
// schema automatically; Pick lists are deliberate choices about what clients may send.
import type { Enums, Tables, TablesInsert, TablesUpdate } from './database';

export type Profile = Tables<'profiles'>

// id and created_at are system-set, so PATCH /profiles/me only accepts these
export type ProfileUpdate = Pick<TablesUpdate<'profiles'>, 'full_name' | 'username' | 'avatar_url'>

export type Event = Tables<'events'>

// 'planning' | 'upcoming' | 'in_progress' | 'done' (Postgres enum event_status)
export type EventStatus = Enums<'event_status'>

export type Group = Tables<'groups'>

// Body of POST /groups. created_by comes from req.user; the creator becomes the owner.
export type GroupCreate = Pick<TablesInsert<'groups'>, 'name' | 'description'>

// Body of POST /events. group_id is required (every event belongs to one group);
// created_by comes from req.user, never the body.
export type EventCreate = Pick<TablesInsert<'events'>, 'group_id' | 'title' | 'description' | 'final_location'>

export type Calendar = Tables<'calendars'>

// 'manual' | 'google' | 'outlook' (Postgres enum calendar_source)
export type CalendarSource = Enums<'calendar_source'>

export type BusyBlock = Tables<'busy_blocks'>

// Body of POST /busy-blocks. calendar_id comes from the caller's manual calendar, never the body.
export type BusyBlockCreate = Pick<TablesInsert<'busy_blocks'>, 'start_date' | 'end_date' | 'start_time' | 'end_time' | 'repeat_days' | 'timezone'>

// Body of PATCH /busy-blocks/:id: any subset of the create fields.
export type BusyBlockUpdate = Pick<TablesUpdate<'busy_blocks'>, 'start_date' | 'end_date' | 'start_time' | 'end_time' | 'repeat_days' | 'timezone'>

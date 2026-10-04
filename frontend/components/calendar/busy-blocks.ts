import type { BusyTimeInitial, BusyTimeValues } from '@/components/calendar/busy-time-sheet';
import type { WeekCalendarBlock } from '@/components/calendar/week-calendar';
import type { BusyBlock, BusyBlockCreate, BusyBlockUpdate } from '@/lib/repositories/busy-blocks';

/** A device-local date as YYYY-MM-DD (toISOString would shift it to UTC). */
export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** "2026-10-07" → local midnight that day (new Date("2026-10-07") would be UTC midnight). */
export const fromDateString = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** "14:30:00" → 870 */
const minutesOf = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const toTimeString = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** "14:30:00" → 14.5 */
const hoursOf = (time: string) => minutesOf(time) / 60;

const deviceTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';

/** The Sunday that starts the week containing `d`. */
const sundayOf = (d: Date) => {
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - d.getDay());
  return sunday;
};

/** The POST /busy-blocks body for what the form saved. Weekly blocks start from the opened day's week. */
export function toBusyBlockCreate(values: BusyTimeValues): BusyBlockCreate {
  const times = {
    start_time: toTimeString(values.startMinutes),
    end_time: toTimeString(values.endMinutes),
    timezone: deviceTimeZone(),
  };
  if (!values.recurring) {
    return { ...times, start_date: toDateString(values.date), end_date: null, repeat_days: null };
  }
  return {
    ...times,
    start_date: toDateString(sundayOf(values.date)),
    end_date: values.until ? toDateString(values.until) : null,
    repeat_days: values.days,
  };
}

/** Form values for editing a saved block. `occurrence` is the tapped day (a weekly block shows on several). */
export function toBusyTimeInitial(block: BusyBlock, occurrence: Date): BusyTimeInitial {
  const recurring = block.repeat_days !== null;
  return {
    date: recurring ? occurrence : fromDateString(block.start_date),
    startMinutes: minutesOf(block.start_time),
    endMinutes: minutesOf(block.end_time),
    recurring,
    days: block.repeat_days ?? undefined,
    until: block.end_date ? fromDateString(block.end_date) : null,
  };
}

/**
 * The PATCH body for an edited block. Every field is sent (not just changed ones) so the server never
 * merges half a change, e.g. turning a weekly block one-off while its stored end_date remains. A block
 * that stays weekly keeps its original start_date, and its stored timezone is kept as-is.
 */
export function toBusyBlockUpdate(values: BusyTimeValues, block: BusyBlock): BusyBlockUpdate {
  const fields = toBusyBlockCreate(values);
  const stillWeekly = values.recurring && block.repeat_days !== null;
  return {
    ...fields,
    start_date: stillWeekly ? block.start_date : fields.start_date,
    timezone: block.timezone,
  };
}

/**
 * Places blocks on the grid for the week starting `weekStart` (a Sunday). One-off blocks land on their
 * day; weekly blocks are expanded onto each of their weekdays that falls inside their start / end dates.
 * Times are shown as stored, assuming the block's timezone is the device's (true for blocks made here).
 */
export function blocksForWeek(blocks: BusyBlock[], weekStart: Date): WeekCalendarBlock[] {
  const placed: WeekCalendarBlock[] = [];
  for (let day = 0; day < 7; day++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + day);
    const dateString = toDateString(date);
    for (const block of blocks) {
      const onThisDay = block.repeat_days
        ? block.repeat_days.includes(day)
          && block.start_date <= dateString
          && (block.end_date === null || block.end_date >= dateString)
        : block.start_date === dateString;
      if (onThisDay) {
        placed.push({
          id: `${block.id}:${dateString}`,
          day,
          startHour: hoursOf(block.start_time),
          endHour: hoursOf(block.end_time),
        });
      }
    }
  }
  return placed;
}

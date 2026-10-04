import {
  blocksForWeek,
  fromDateString,
  toBusyBlockCreate,
  toBusyBlockUpdate,
  toBusyTimeInitial,
  toDateString,
} from '@/components/calendar/busy-blocks';
import { BusyTimeSheet, type BusyTimeInitial, type BusyTimeValues } from '@/components/calendar/busy-time-sheet';
import { WeekCalendar, weekStartFor, type WeekCalendarBlock } from '@/components/calendar/week-calendar';
import { busyBlocksRepo, type BusyBlock } from '@/lib/repositories/busy-blocks';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// The + button starts at the next full hour, for one hour.
const nextHourDefault = (): BusyTimeInitial => {
  const now = new Date();
  const start = Math.min((now.getHours() + 1) * 60, 22 * 60);
  return { date: now, startMinutes: start, endMinutes: start + 60 };
};

// The signed-in user's own calendar: their busy blocks for the visible week, from GET /busy-blocks/me.
export default function MyCalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [week, setWeek] = useState(0);
  const [sheetInitial, setSheetInitial] = useState<BusyTimeInitial | null>(null);
  // A drawn block stays on the grid while its form is open.
  const [pending, setPending] = useState<WeekCalendarBlock | null>(null);
  // The saved block open in the sheet, and which day's copy was tapped (highlighted on the grid).
  const [editing, setEditing] = useState<{ block: BusyBlock; gridId: string } | null>(null);
  const [blocks, setBlocks] = useState<BusyBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const weekStart = weekStartFor(week);

  // Loads the visible week; returns a cancel function so a slow response for a week the user has
  // already paged away from is dropped. Runs on focus and whenever the week changes, and after a save.
  const loadWeek = useCallback(() => {
    let cancelled = false;
    const start = weekStartFor(week);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    setLoading(true);
    busyBlocksRepo.getMine(toDateString(start), toDateString(end))
      .then((data) => {
        if (cancelled) return;
        setBlocks(data);
        setLoadError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Could not load your calendar');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [week]);
  useFocusEffect(loadWeek);

  const handleDrawBlock = (day: number, startHour: number, endHour: number) => {
    const date = weekStartFor(week);
    date.setDate(date.getDate() + day);
    setEditing(null);
    setPending({ id: 'pending', day, startHour, endHour });
    setSheetInitial({ date, startMinutes: startHour * 60, endMinutes: endHour * 60 });
  };

  const openAdd = () => {
    setEditing(null);
    setPending(null);
    setSheetInitial(nextHourDefault());
  };

  // Grid ids are "<block id>:<YYYY-MM-DD>" (see blocksForWeek), since a weekly block shows on several days.
  const handleBlockPress = (gridId: string) => {
    const [blockId, dateString] = gridId.split(':');
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !dateString) return;
    setPending(null);
    setEditing({ block, gridId });
    setSheetInitial(toBusyTimeInitial(block, fromDateString(dateString)));
  };

  const closeSheet = () => {
    setSheetInitial(null);
    setPending(null);
    setEditing(null);
  };

  // Errors propagate to the sheet, which shows them and stays open.
  const handleSave = async (values: BusyTimeValues) => {
    if (editing) {
      await busyBlocksRepo.update(editing.block.id, toBusyBlockUpdate(values, editing.block));
    } else {
      await busyBlocksRepo.create(toBusyBlockCreate(values));
    }
    closeSheet();
    loadWeek();
  };

  const handleDelete = async () => {
    if (!editing) return;
    await busyBlocksRepo.remove(editing.block.id);
    closeSheet();
    loadWeek();
  };

  const gridBlocks = blocksForWeek(blocks, weekStart);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={({ pressed }) => [pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={30} />
          </Pressable>
          {loading ? <ActivityIndicator color="#6096c3" /> : null}
        </View>

        {loadError ? (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>{loadError}</Text>
            <Pressable onPress={() => loadWeek()} hitSlop={8}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        <WeekCalendar
          week={week}
          onWeekChange={setWeek}
          blocks={pending ? [...gridBlocks, pending] : gridBlocks}
          selectedId={pending?.id ?? editing?.gridId}
          onBlockPress={handleBlockPress}
          onDrawBlock={handleDrawBlock}
          style={styles.calendar}
        />

        <Pressable
          onPress={openAdd}
          style={({ pressed }) => [styles.addButton, { bottom: insets.bottom + 35 }, pressed && styles.pressed]}>
          <Ionicons name="add" size={25} color="#131313" />
        </Pressable>

        <BusyTimeSheet
          initial={sheetInitial}
          onClose={closeSheet}
          onSave={handleSave}
          onDelete={editing ? handleDelete : undefined}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Same spacing as the back arrow in the event calendar's header.
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#c0392b',
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
    color: '#6096c3',
  },
  calendar: {
    flex: 1,
  },
  // Matches CalendarPanel's bigButton.
  addButton: {
    position: 'absolute',
    right: 28,
    width: 48,
    height: 48,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#6096c3',
    backgroundColor: '#D2E1ED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});

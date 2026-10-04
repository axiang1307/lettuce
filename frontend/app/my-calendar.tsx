import { BusyTimeSheet, type BusyTimeInitial } from '@/components/calendar/busy-time-sheet';
import { WeekCalendar, weekStartFor, type WeekCalendarBlock } from '@/components/calendar/week-calendar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// The + button starts at the next full hour, for one hour.
const nextHourDefault = (): BusyTimeInitial => {
  const now = new Date();
  const start = Math.min((now.getHours() + 1) * 60, 22 * 60);
  return { date: now, startMinutes: start, endMinutes: start + 60 };
};

// The signed-in user's own calendar. Shows no saved blocks until the busy-blocks API exists.
export default function MyCalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [week, setWeek] = useState(0);
  const [sheetInitial, setSheetInitial] = useState<BusyTimeInitial | null>(null);
  // A drawn block stays on the grid while its form is open.
  const [pending, setPending] = useState<WeekCalendarBlock | null>(null);

  const handleDrawBlock = (day: number, startHour: number, endHour: number) => {
    const date = weekStartFor(week);
    date.setDate(date.getDate() + day);
    setPending({ id: 'pending', day, startHour, endHour });
    setSheetInitial({ date, startMinutes: startHour * 60, endMinutes: endHour * 60 });
  };

  const closeSheet = () => {
    setSheetInitial(null);
    setPending(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={({ pressed }) => [pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={30} />
          </Pressable>
        </View>

        <WeekCalendar
          week={week}
          onWeekChange={setWeek}
          blocks={pending ? [pending] : []}
          selectedId={pending?.id}
          onDrawBlock={handleDrawBlock}
          style={styles.calendar}
        />

        <Pressable
          onPress={() => setSheetInitial(nextHourDefault())}
          style={({ pressed }) => [styles.addButton, { bottom: insets.bottom + 35 }, pressed && styles.pressed]}>
          <Ionicons name="add" size={25} color="#131313" />
        </Pressable>

        {/* No API yet: saving just closes the sheet. */}
        <BusyTimeSheet initial={sheetInitial} onClose={closeSheet} onSave={closeSheet} />
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
    paddingHorizontal: 16,
    paddingBottom: 14,
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

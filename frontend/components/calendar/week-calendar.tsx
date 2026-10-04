import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];
const dow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
                '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
                '6 PM', '7 PM', '8 PM', '9 PM', '10 PM',
];
const FIRST_HOUR = 8;
const LAST_HOUR = FIRST_HOUR + hours.length; // the 10 PM row ends at 11 PM
const ROW_H = 59;
const TIME_COL_RATIO = 64 / 402;
const SNAP_MIN = 15;
const LONG_PRESS_MS = 300;

/** A block being drawn. Minutes are after midnight and snapped to SNAP_MIN. */
type Draft = { day: number; anchor: number; current: number; moved: boolean };

/** The SNAP_MIN slot under a y offset in the hour grid, clamped to the grid. */
function slotAt(y: number) {
    const minutes = FIRST_HOUR * 60 + (y / ROW_H) * 60;
    const snapped = Math.floor(minutes / SNAP_MIN) * SNAP_MIN;
    return Math.min(Math.max(snapped, FIRST_HOUR * 60), LAST_HOUR * 60 - SNAP_MIN);
}

/** A press without dragging draws one hour; otherwise the range covers both slots. */
function draftRange({ anchor, current, moved }: Draft) {
    if (!moved) return { start: anchor, end: Math.min(anchor + 60, LAST_HOUR * 60) };
    return { start: Math.min(anchor, current), end: Math.max(anchor, current) + SNAP_MIN };
}

/** A block on the grid. `day` is 0 (Sunday) to 6; hours are 24h and may be fractional (14.5 = 2:30 PM). */
export type WeekCalendarBlock = {
  id: string;
  day: number;
  startHour: number;
  endHour: number;
};

/** The Sunday that starts the week `week` weeks from the current one. */
export function weekStartFor(week: number) {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + week * 7);
    return d;
}

type WeekCalendarProps = {
  /** Weeks from the current week (0 = this week). */
  week: number;
  onWeekChange: (week: number) => void;
  blocks: WeekCalendarBlock[];
  selectedId?: string;
  onBlockPress?: (id: string) => void;
  /** Turns on long-press-and-drag drawing; called with the drawn range when the finger lifts. */
  onDrawBlock?: (day: number, startHour: number, endHour: number) => void;
  style?: StyleProp<ViewStyle>;
};

export function WeekCalendar({ week, onWeekChange, blocks, selectedId, onBlockPress, onDrawBlock, style }: WeekCalendarProps) {
    const [gridWidth, setGridWidth] = useState(0);
    const timeColW = gridWidth * TIME_COL_RATIO;
    const cellW = (gridWidth - timeColW) / 7;

    const [draft, setDraft] = useState<Draft | null>(null);
    const draftBlock = draft ? draftRange(draft) : null;

    // Activates only after a still hold, so a normal swipe still scrolls the grid. The detector picks up
    // each render's callbacks, so onEnd reads the latest draft.
    const drawGesture = Gesture.Pan()
        .enabled(!!onDrawBlock && gridWidth > 0)
        .activateAfterLongPress(LONG_PRESS_MS)
        .runOnJS(true)
        .onStart((e) => {
            const day = Math.floor((e.x - timeColW) / cellW);
            if (e.x < timeColW || day < 0 || day > 6) return;
            const slot = slotAt(e.y);
            setDraft({ day, anchor: slot, current: slot, moved: false });
            if (process.env.EXPO_OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        })
        .onUpdate((e) => {
            const slot = slotAt(e.y);
            setDraft((d) => (d && slot !== d.current ? { ...d, current: slot, moved: true } : d));
        })
        .onEnd(() => {
            if (!draft || !draftBlock) return;
            onDrawBlock?.(draft.day, draftBlock.start / 60, draftBlock.end / 60);
        })
        .onFinalize(() => setDraft(null));

    const dayOfWeek = new Date().getDay();
    const weekStart = weekStartFor(week);
    const dayNums = Array.from({length: 7}, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d.getDate();
    });

    return (
        <View style = {[styles.calendar, style]} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
            <View style = {styles.monthHeader}>
                <Text style = {{
                    flex: 147,
                    fontSize: 18,
                    fontFamily: 'Montserrat_600SemiBold',
                    fontWeight: '600',
                    lineHeight: 23.40,
                    }}
                >
                    {`${months[weekStart.getMonth()]} ${weekStart.getFullYear()}`}
                </Text>
                <Pressable onPress={() => onWeekChange(week-1)}>
                    <Ionicons name = "chevron-back" size = {28}/>
                </Pressable>
                <Pressable onPress={() => onWeekChange(week+1)}>
                    <Ionicons name = "chevron-forward" size = {28}/>
                </Pressable>
            </View>
            <View style = {styles.dateHeader}>
                <View style = {{
                    width: timeColW,
                    backgroundColor: '#ffffff',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Pressable
                        onPress={() => onWeekChange(0)}
                        hitSlop={6}
                        style={({ pressed }) => [styles.todayButton, pressed && { opacity: 0.7 }]}
                    >
                        <Text style = {styles.todayText}>Today</Text>
                    </Pressable>
                </View>
                <View style = {{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: 8,
                    paddingRight: 8,
                    justifyContent: 'space-between',
                    alignContent: 'center',
                }}>
                    {dayNums.map((day, index) => {
                        const isToday = week ===0 && index === dayOfWeek;
                        return(
                        <View key={index} style = {{
                            flex: 1,
                            alignItems: 'center',

                        }}>
                            <Text style = {{color: '#878787', fontSize: 12, fontFamily: 'DMSans_400Regular', fontWeight: '400', lineHeight: 18}}>
                                {dow[index]}
                            </Text>
                            <View style = {isToday ? styles.circle: null}>
                            <Text style = {styles.circledSingle}
                            >
                            {day}
                            </Text>
                            </View>
                        </View>
                        );
                    })}
                </View>
            </View>
            <View style = {styles.times}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} scrollEnabled={!draft}>
                    <GestureDetector gesture={drawGesture}>
                    <View style={{ position: 'relative' }}>
                        {hours.map((hour, index) => (
                            <View key={index} style={{ flexDirection: 'row' }}>
                                <View style={[styles.hourbox, { width: timeColW }]}>
                                    <Text style={{ color: '#878787', fontSize: 12, fontFamily: 'DMSans_400Regular', fontWeight: '400', lineHeight: 18 }}>{hour}</Text>
                                </View>
                                {dayNums.map((day, i) => (
                                    <View key={i} style={{
                                        width: cellW,
                                        borderLeftWidth: 1,
                                        borderLeftColor: '#dbdbdb',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#dbdbdb',
                                    }} />
                                ))}
                            </View>
                        ))}
                        {gridWidth > 0 && blocks.map((b) =>
                            b.day >= 0 && b.day <= 6 && b.endHour > b.startHour ? (
                                <Pressable
                                    key={b.id}
                                    onPress={() => onBlockPress?.(b.id)}
                                    style={[
                                        styles.block,
                                        {
                                            top: (b.startHour - FIRST_HOUR) * ROW_H,
                                            height: (b.endHour - b.startHour) * ROW_H,
                                            left: timeColW + b.day * cellW,
                                            width: cellW,
                                        },
                                        b.id === selectedId && styles.blockSelected,
                                    ]}
                                />
                            ) : null
                        )}
                        {gridWidth > 0 && draft && draftBlock ? (
                            <View
                                pointerEvents="none"
                                style={[
                                    styles.block,
                                    styles.draftBlock,
                                    {
                                        top: (draftBlock.start / 60 - FIRST_HOUR) * ROW_H,
                                        height: ((draftBlock.end - draftBlock.start) / 60) * ROW_H,
                                        left: timeColW + draft.day * cellW,
                                        width: cellW,
                                    },
                                ]}
                            />
                        ) : null}
                    </View>
                    </GestureDetector>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    calendar:{
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    monthHeader:{
        flex: 72,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 24,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    dateHeader:{
        flex: 78,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#dbdbdb',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
    },
    todayButton: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#6096c3',
        backgroundColor: '#D2E1ED',
    },
    todayText: {
        fontSize: 11,
        fontFamily: 'DMSans_600SemiBold',
        lineHeight: 15,
        color: '#131313',
    },
    times:{
        flex: 476,
    },
    circle: {
      backgroundColor: '#8CB3D4',
      borderRadius: 50,
    },
    hourbox: {
        height: ROW_H,
        paddingTop: 9,
        paddingLeft: 8,
        paddingBottom: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
    },
    circledSingle: {
        fontSize: 17,
        fontFamily: 'Montserrat_600SemiBold',
        fontWeight: '600',
        lineHeight: 23.40,
        paddingHorizontal: 9,
        paddingVertical: 4.5,
    },
    block: {
        position: 'absolute',
        backgroundColor: '#b6cfe3',
        borderRadius: 6,
        opacity: 0.85,
    },
    draftBlock: {
        opacity: 0.6,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#6096c3',
    },
    blockSelected: {
        opacity: 1,
        borderWidth: 2,
        borderColor: '#6096c3',
    },
})

import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HomeFeedEvent } from '@/data/home-feed';

type CalendarPanelProps = {
  event: HomeFeedEvent;
  onSendToPoll: () => void;
};

export function CalendarPanel({ event, onSendToPoll }: CalendarPanelProps) {
  const initial = event.calendar.selectedOptionId ?? event.calendar.options[0]?.id;
  const [selectedId, setSelectedId] = useState<string | undefined>(initial);
  const selected = useMemo(
    () => event.calendar.options.find((item) => item.id === selectedId),
    [event.calendar.options, selectedId],
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.monthRow}>
        <Text style={styles.monthText}>{event.calendar.monthLabel}</Text>
        <View style={styles.monthActions}>
          <MaterialIcons name="chevron-left" size={24} color="#131313" />
          <MaterialIcons name="chevron-right" size={24} color="#131313" />
        </View>
      </View>

      <View style={styles.calendarGrid}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <View key={`${day}-${idx}`} style={styles.gridHead}>
            <Text style={styles.gridHeadText}>{day}</Text>
          </View>
        ))}
        {[30, 1, 2, 3, 4, 5, 6].map((date, idx) => (
          <View key={`${date}`} style={styles.gridDate}>
            <Text style={[styles.gridDateText, idx === 0 && styles.gridDateTextSelected]}>{date}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.weekLabel}>{event.calendar.weekLabel}</Text>
        <View style={styles.divider} />
        <View style={styles.options}>
          {event.calendar.options.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                style={({ pressed }) => [styles.optionRow, isSelected && styles.optionRowSelected, pressed && styles.pressed]}>
                <Text style={styles.optionLabel}>{item.label}</Text>
                <Text style={styles.optionTime}>{item.timeRange}</Text>
              </Pressable>
            );
          })}
          <Pressable
            style={({ pressed }) => [styles.optionRow, styles.addRow, pressed && styles.pressed]}
            onPress={() => undefined}>
            <Text style={styles.optionLabel}>Add Option</Text>
            <View style={styles.addCircle}>
              <MaterialIcons name="add" size={20} color="#6096c3" />
            </View>
          </Pressable>
        </View>

        <View style={styles.ctaWrap}>
          <Pressable
            onPress={onSendToPoll}
            disabled={!selected}
            style={({ pressed }) => [styles.sendBtn, !selected && styles.sendBtnDisabled, pressed && styles.pressed]}>
            <Text style={styles.sendText}>Send to Poll</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  monthRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthText: {
    fontSize: 34 / 1.58,
    lineHeight: 29.6,
    fontWeight: '600',
    color: '#131313',
  },
  monthActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarGrid: {
    borderTopWidth: 1,
    borderColor: '#e4e4e4',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridHead: {
    width: '14.285%',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridHeadText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#878787',
  },
  gridDate: {
    width: '14.285%',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridDateText: {
    width: 34,
    height: 34,
    borderRadius: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 32 / 1.58,
    lineHeight: 23.4,
    fontWeight: '600',
    color: '#131313',
    overflow: 'hidden',
  },
  gridDateTextSelected: {
    backgroundColor: '#b6cfe3',
  },
  bottomSheet: {
    borderTopWidth: 1,
    borderColor: '#d7d7d7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  dragHandle: {
    alignSelf: 'center',
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#9e9e9e',
  },
  weekLabel: {
    fontSize: 52 / 1.58,
    lineHeight: 45,
    fontWeight: '600',
    color: '#131313',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#d7d7d7',
  },
  options: {
    gap: 10,
  },
  optionRow: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: '#eaf3f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  optionRowSelected: {
    borderWidth: 1,
    borderColor: '#9cad50',
    backgroundColor: '#f0f2e3',
  },
  optionLabel: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  optionTime: {
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '600',
    color: '#131313',
  },
  addRow: {
    backgroundColor: '#dbe9f4',
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6096c3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaWrap: {
    alignItems: 'flex-end',
  },
  sendBtn: {
    height: 36,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#e4e4e4',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#131313',
  },
  pressed: {
    opacity: 0.95,
  },
});

import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HomeFeedEvent, PollOption } from '@/data/home-feed';

type PollPanelProps = {
  event: HomeFeedEvent;
  onSendToCalendar: () => void;
};

function OptionResultsRow({ option, totalVotes }: { option: PollOption; totalVotes: number }) {
  const pct = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
  return (
    <View style={[styles.resultOption, option.isWinning && styles.resultOptionWinning]}>
      <View style={[styles.resultFill, { width: `${Math.min(100, pct)}%` }, option.isWinning && styles.resultFillWinning]} />
      <View style={styles.resultTextWrap}>
        <Text style={styles.optionTitle}>{option.label}</Text>
        <Text style={styles.optionMeta}>
          {pct}% {option.votes} vote{option.votes === 1 ? '' : 's'}
        </Text>
      </View>
    </View>
  );
}

export function PollPanel({ event, onSendToCalendar }: PollPanelProps) {
  const [selected, setSelected] = useState<string | null>(event.poll.pendingOptions[0]?.id ?? null);
  const totalVotes = useMemo(
    () => event.poll.completedOptions.reduce((sum, option) => sum + option.votes, 0),
    [event.poll.completedOptions],
  );
  const showPending = event.poll.visualState === 'pending' || event.poll.visualState !== 'results';

  return (
    <View style={styles.wrap}>
      {showPending ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending</Text>
          <View style={styles.pollCard}>
            <Text style={styles.question}>{event.poll.pendingQuestion}</Text>
            <Text style={styles.link}>See Details</Text>
            <View style={styles.options}>
              {event.poll.pendingOptions.map((option) => {
                const active = option.id === selected;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => setSelected(option.id)}
                    style={({ pressed }) => [styles.pendingOption, active && styles.pendingOptionSelected, pressed && styles.pressed]}>
                    <View style={[styles.radio, active && styles.radioSelected]} />
                    <Text style={styles.optionTitle}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              disabled={!selected}
              style={({ pressed }) => [styles.voteBtn, !selected && styles.voteBtnDisabled, pressed && styles.pressed]}>
              <Text style={styles.voteText}>Vote</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed</Text>
        <View style={styles.pollCard}>
          <Text style={styles.question}>{event.poll.completedQuestion}</Text>
          <Text style={styles.link}>See Details</Text>
          <View style={styles.options}>
            {event.poll.completedOptions.map((option) => (
              <OptionResultsRow key={option.id} option={option} totalVotes={totalVotes} />
            ))}
          </View>
          <Pressable
            onPress={onSendToCalendar}
            style={({ pressed }) => [
              styles.voteBtn,
              event.poll.visualState === 'results' && styles.voteBtnDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.voteText, event.poll.visualState === 'results' && styles.voteTextDisabled]}>
              {event.poll.visualState === 'calendarReady' ? 'Send to Calendar' : 'Vote'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 32 / 1.58,
    lineHeight: 29.61,
    fontWeight: '600',
    color: '#131313',
  },
  pollCard: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 20,
    gap: 12,
  },
  question: {
    fontSize: 30 / 1.58,
    lineHeight: 29.6,
    fontWeight: '600',
    color: '#131313',
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#878787',
    textAlign: 'center',
  },
  options: {
    gap: 10,
  },
  pendingOption: {
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendingOptionSelected: {
    borderWidth: 1,
    borderColor: '#9cad50',
    backgroundColor: '#f0f2e3',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#cecece',
  },
  radioSelected: {
    backgroundColor: '#9cad50',
  },
  optionTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#131313',
  },
  optionMeta: {
    fontSize: 12,
    lineHeight: 18,
    color: '#878787',
  },
  resultOption: {
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: '#e4e4e4',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  resultOptionWinning: {
    borderWidth: 1,
    borderColor: '#9cad50',
  },
  resultFill: {
    ...StyleSheet.absoluteFillObject,
    width: '0%',
    backgroundColor: '#cecece',
  },
  resultFillWinning: {
    backgroundColor: 'rgba(156,173,80,0.45)',
  },
  resultTextWrap: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  voteBtn: {
    height: 36,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#5e6930',
    backgroundColor: '#5e6930',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteBtnDisabled: {
    borderColor: '#cecece',
    backgroundColor: '#cecece',
  },
  voteText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#ffffff',
  },
  voteTextDisabled: {
    color: '#b6b6b6',
  },
  pressed: {
    opacity: 0.95,
  },
});

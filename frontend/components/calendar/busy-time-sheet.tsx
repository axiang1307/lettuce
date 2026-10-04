import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** What the form starts with. Times are minutes after midnight. */
export type BusyTimeInitial = {
  date: Date;
  startMinutes: number;
  endMinutes: number;
};

/** What the form saves. Times are minutes after midnight; `days` are 0 (Sunday) to 6. */
export type BusyTimeValues = { startMinutes: number; endMinutes: number } & (
  | { recurring: false; date: Date }
  | { recurring: true; days: number[]; until: Date | null }
);

const atMinutes = (date: Date, minutes: number) => {
  const d = new Date(date);
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d;
};
const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();
const startOfToday = () => atMinutes(new Date(), 0);

type FormState = {
  date: Date;
  start: Date;
  end: Date;
  recurring: boolean;
  days: number[];
  until: Date | null;
  error: string | null;
};

const formFrom = (initial: BusyTimeInitial | null): FormState => {
  const base = initial ?? { date: new Date(), startMinutes: 0, endMinutes: 0 };
  return {
    date: atMinutes(base.date, 0),
    start: atMinutes(base.date, base.startMinutes),
    end: atMinutes(base.date, base.endMinutes),
    recurring: false,
    days: [base.date.getDay()],
    until: null,
    error: null,
  };
};

type PickerFieldProps = {
  mode: 'date' | 'time';
  value: Date;
  onChange: (d: Date) => void;
  minimumDate?: Date;
};

// iOS shows the compact native picker inline. Android has no inline picker, so a pill opens its dialog.
function PickerField({ mode, value, onChange, minimumDate }: PickerFieldProps) {
    if (Platform.OS === 'ios') {
        return (
            <DateTimePicker
                mode={mode}
                display="compact"
                value={value}
                minuteInterval={15}
                minimumDate={minimumDate}
                accentColor="#6096c3"
                onValueChange={(_, d) => onChange(d)}
            />
        );
    }
    const label = mode === 'time'
        ? value.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : value.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    return (
        <Pressable
            style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
            onPress={() => DateTimePickerAndroid.open({
                mode,
                value,
                minimumDate,
                onValueChange: (_, d) => onChange(d),
            })}
        >
            <Text style={styles.pillText}>{label}</Text>
        </Pressable>
    );
}

type BusyTimeSheetProps = {
  /** Opens the sheet with these values; `null` closes it. */
  initial: BusyTimeInitial | null;
  onClose: () => void;
  onSave: (values: BusyTimeValues) => void;
};

export function BusyTimeSheet({ initial, onClose, onSave }: BusyTimeSheetProps) {
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheet>(null);
    const [form, setForm] = useState(() => formFrom(initial));
    const { date, start, end, recurring, days, until, error } = form;
    const update = (changes: Partial<FormState>) => setForm((f) => ({ ...f, ...changes }));

    // Reset the form when the sheet opens with new values (adjusting state during render, not in an effect).
    const [openedWith, setOpenedWith] = useState(initial);
    if (initial !== openedWith) {
        setOpenedWith(initial);
        if (initial) setForm(formFrom(initial));
    }

    useEffect(() => {
        if (initial) sheetRef.current?.expand();
        else sheetRef.current?.close();
    }, [initial]);

    const toggleDay = (day: number) => update({
        days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b),
    });

    const handleSave = () => {
        const startMinutes = minutesOf(start);
        const endMinutes = minutesOf(end);
        if (endMinutes <= startMinutes) {
            update({ error: 'End time must be after start time.' });
            return;
        }
        if (recurring && days.length === 0) {
            update({ error: 'Pick at least one day.' });
            return;
        }
        onSave(recurring
            ? { recurring, startMinutes, endMinutes, days, until }
            : { recurring, startMinutes, endMinutes, date });
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
        ),
        [],
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            enablePanDownToClose
            onClose={onClose}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetView style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
                <Text style={styles.title}>Add busy time</Text>

                <View style={styles.segment}>
                    <Pressable
                        onPress={() => update({ recurring: false })}
                        style={[styles.segmentOption, !recurring && styles.selected]}
                    >
                        <Text style={styles.segmentText}>One time</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => update({ recurring: true })}
                        style={[styles.segmentOption, recurring && styles.selected]}
                    >
                        <Text style={styles.segmentText}>Repeats weekly</Text>
                    </Pressable>
                </View>

                {recurring ? (
                    <View style={styles.dayRow}>
                        {DAY_LABELS.map((label, day) => (
                            <Pressable
                                key={day}
                                onPress={() => toggleDay(day)}
                                style={[styles.dayChip, days.includes(day) && styles.selected]}
                            >
                                <Text style={styles.dayChipText}>{label}</Text>
                            </Pressable>
                        ))}
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.label}>Date</Text>
                        <PickerField mode="date" value={date} onChange={(d) => update({ date: atMinutes(d, 0) })} />
                    </View>
                )}

                <View style={styles.row}>
                    <Text style={styles.label}>Starts</Text>
                    <PickerField mode="time" value={start} onChange={(d) => update({ start: d })} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Ends</Text>
                    <PickerField mode="time" value={end} onChange={(d) => update({ end: d })} />
                </View>

                {recurring ? (
                    <View style={styles.row}>
                        <Text style={styles.label}>Until</Text>
                        {until ? (
                            <View style={styles.untilWrap}>
                                <PickerField mode="date" value={until} minimumDate={startOfToday()} onChange={(d) => update({ until: atMinutes(d, 0) })} />
                                <Pressable onPress={() => update({ until: null })} hitSlop={8}>
                                    <Text style={styles.clearText}>Clear</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={() => {
                                    const d = startOfToday();
                                    d.setMonth(d.getMonth() + 3);
                                    update({ until: d });
                                }}
                                style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
                            >
                                <Text style={styles.pillText}>No end date</Text>
                            </Pressable>
                        )}
                    </View>
                ) : null}

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <OnboardingPrimaryButton label="Save" onPress={handleSave} style={styles.saveButton} />
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#dbdbdb',
    },
    handleIndicator: {
        backgroundColor: '#9e9e9e',
        width: 50,
        height: 5,
    },
    content: {
        paddingTop: 10,
        paddingHorizontal: 24,
        gap: 18,
    },
    title: {
        fontSize: 28.83,
        fontFamily: 'Montserrat_600SemiBold',
        fontWeight: '600',
        lineHeight: 37.48,
        color: '#131313',
    },
    segment: {
        flexDirection: 'row',
        gap: 8,
    },
    segmentOption: {
        flex: 1,
        height: 40,
        borderRadius: 32,
        borderWidth: 1.5,
        borderColor: '#E4E4E4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentText: {
        fontSize: 14,
        fontFamily: 'DMSans_600SemiBold',
        color: '#131313',
    },
    selected: {
        borderColor: '#6096c3',
        backgroundColor: '#d2e1ed',
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayChip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E4E4E4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayChipText: {
        fontSize: 15,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#131313',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
    },
    label: {
        fontSize: 16,
        fontFamily: 'DMSans_600SemiBold',
        color: '#131313',
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        backgroundColor: '#EAF3F9',
    },
    pillText: {
        fontSize: 16,
        fontFamily: 'DMSans_400Regular',
        color: '#131313',
    },
    untilWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clearText: {
        fontSize: 14,
        fontFamily: 'DMSans_600SemiBold',
        color: '#6096c3',
    },
    error: {
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
        color: '#c0392b',
    },
    saveButton: {
        marginTop: 6,
    },
    pressed: {
        opacity: 0.7,
    },
});

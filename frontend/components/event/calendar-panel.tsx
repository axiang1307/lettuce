import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeekCalendar, weekStartFor, type WeekCalendarBlock } from '@/components/calendar/week-calendar';
import { ParticipantsProfiles } from '@/components/home/participants-profiles';
import type { HomeFeedEvent } from '@/data/home-feed';

/** Turns a mock option like ("Sunday, 12/07", "1-3pm") into a grid block. */
function parseBlock(id: string, label: string, timeRange: string): WeekCalendarBlock {
  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };
  const day = dayMap[label.split(',')[0].trim().toLowerCase()] ?? -1;
  const parseHour = (s: string) => {
    const isPM = s.toLowerCase().includes('pm');
    const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
    if (isPM && n !== 12) return n + 12;
    if (!isPM && n === 12) return 0;
    return n;
  };
  const [startStr, endStr] = timeRange.split('-');
  const suffix = endStr.toLowerCase().includes('am') ? 'AM' : 'PM';
  const startHour = parseHour(startStr.includes('M') ? startStr : startStr + suffix);
  const endHour = parseHour(endStr);
  return { id, day, startHour, endHour };
}

type CalendarPanelProps = {
  event: HomeFeedEvent;
  onBack: () => void;
  onSendToPoll: () => void;
};

export function CalendarPanel({ event, onBack, onSendToPoll }: CalendarPanelProps) {
    const insets = useSafeAreaInsets();
    const [week, setWeek] = useState(0);
    const [selectedId, setSelectedId] = useState<string | undefined>(
        event.calendar.selectedOptionId ?? event.calendar.options[0]?.id,
    );
    const blocks = useMemo(
        () => event.calendar.options.map((o) => parseBlock(o.id, o.label, o.timeRange)),
        [event.calendar.options],
    );
    const weekStart = weekStartFor(week);

    return (
        //safeareaview instead of view so that the text shows
        <GestureHandlerRootView style = {{ flex: 1 }}>
            <View style = {styles.view}>  
                <ImageBackground
                source = {event.imageUrl}
                style = {[styles.header, { paddingTop: insets.top + 8 }]}
                imageStyle = { {transform: [{ scale: 1.18},{translateY: 16}], opacity: 0.55} }
                >
                    <Pressable onPress={onBack}>
                        <View style = {styles.arrow}>
                            <Ionicons name = "arrow-back" size = {30} />
                        </View>
                    </Pressable>
                    <View>
                        <Text style = {styles.title}>{`${event.title}\nCalendar`}</Text>
                    </View>
                    <View style = {styles.profiles}>
                        <ParticipantsProfiles avatars={event.participants.avatars} moreCount={event.participants.moreCount ?? 0}/>
                    </View>
                </ImageBackground>
                <WeekCalendar
                    week={week}
                    onWeekChange={setWeek}
                    blocks={blocks}
                    selectedId={selectedId}
                    onBlockPress={setSelectedId}
                    style={styles.calendar}
                />
                <View>
                    <Pressable style={styles.bigButton}>                                                                                                        
                        <Ionicons name="add" size={25} color="#131313" />
                    </Pressable>
                </View>
                <BottomSheet index = {0} snapPoints = {[25,393]}
                    backgroundStyle = {{
                        borderTopWidth: 1,
                        borderTopColor: '#dbdbdb',
                        borderTopLeftRadius: 20,                                                                                          
                        borderTopRightRadius: 20,
                        borderLeftWidth: 1,
                        borderLeftColor: '#dbdbdb',
                        borderRightWidth: 1,
                        borderRightColor: '#dbdbdb',
                        
                    }}
                    handleIndicatorStyle = {{
                        backgroundColor: '#9e9e9e',
                        width:50,
                        height: 5,

                    }}
                    >
                    <BottomSheetView style = {styles.bottomsheet}>
                        <Text style = {{
                            fontSize: 28.83, fontFamily: 'Montserrat_600SemiBold', fontWeight: '600', lineHeight: 37.48,
                            color: '#131313'
                        }}>
                            {`Week of ${weekStart.getMonth() + 1}/${weekStart.getDate()}/${weekStart.getFullYear()%100}`}
                        </Text>
                        <View style = {{
                            height: 24

                        }}></View>
                        <View style = {{
                            height: 1,
                            backgroundColor: '#E4E4E4',
                        }}>
                        </View>
                        <View style = {{
                            height: 24
                        }}></View>
                        <View style={styles.optionbox}>
                            {event.calendar.options.slice(0, 2).map((item) => {
                                const isSelected = item.id === selectedId;
                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => setSelectedId(item.id)}
                                        style={[styles.addOption, isSelected && styles.optionSelected]}
                                    >
                                        <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat_600SemiBold', fontWeight: '600', lineHeight: 20.80, paddingTop: 6 }}>
                                            {item.label}
                                        </Text>
                                        <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat_600SemiBold', fontWeight: '600', lineHeight: 20.80, paddingTop: 6 }}>
                                            {item.timeRange}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                            <View style={styles.addOption}>
                                <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat_600SemiBold', fontWeight: '600', lineHeight: 20.80, paddingTop: 6 }}>
                                    Add Option
                                </Text>
                                <Pressable style={styles.button}>
                                    <Ionicons name="add" size={20} color="#131313" />
                                </Pressable>
                            </View>
                        </View>
                        <View style = {{
                            height: 36,
                            width: '100%',
                        }}>
                            <Pressable onPress={onSendToPoll} style = {{
                                height: 36,
                                alignSelf: 'flex-end',
                                paddingHorizontal: 16,
                                borderWidth: 2,
                                borderColor: '#E4E4E4',
                                justifyContent: 'center',
                                alignContent: 'center',
                                borderRadius: 32,
                                shadowColor: '#000',
                                shadowOpacity: 0.15,
                                shadowRadius: 2,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 2,

                            }}>
                                <Text style = {{
                                    fontSize: 14, fontFamily: 'DMSans_600SemiBold', fontWeight: '500', lineHeight: 21, color: '#131313'
                                }}>
                                    Send to Poll
                                </Text>
                            </Pressable>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',

    },
    //823 vertical flex
    header:{
        flex: 215,
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    calendar:{
        flex: 626,
    },
    arrow:{
        width: '100%',
        paddingBottom: 6,
    },
    title:{
        fontSize: 28.83,
        fontFamily: 'Montserrat_600SemiBold',
        fontWeight: 600,
        lineHeight: 37.48, 
                paddingBottom: 16,
    },
    profiles:{
        paddingBottom: 8,
    },     
    bottomsheet: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 24,
        paddingBottom: 32,

    },
    optionbox: {
        height: 215,
        paddingBottom: 24,
        justifyContent: 'space-between',
    },
    optionSelected: {
        borderWidth: 1.5,
        borderColor: '#6096c3',
        backgroundColor: '#d2e1ed',
    },
    addOption:{
        backgroundColor: '#EAF3F9',
        height: 54,
        paddingVertical: 11,
        paddingHorizontal: 24,
        borderTopLeftRadius: 8,                                                                                          
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,                                                                                          
        borderBottomRightRadius: 8,
        shadowColor: '#000',                                                                                       
        shadowOpacity: 0.15,
        shadowRadius: 3,                                                                                           
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,  // Android       
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    button: {
        width: 36,                                                                                             
        height: 36,                                                                                              
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
    bigButton: {
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
        position: 'absolute',
        bottom: 35,
        left: 125,
    }

})
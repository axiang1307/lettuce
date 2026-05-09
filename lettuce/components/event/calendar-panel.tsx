import React, { useState } from 'react';//default import from react
import { View , Text, StyleSheet, Pressable, ImageBackground, ScrollView } from 'react-native';//named exports from react-native
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { Ionicons } from '@expo/vector-icons';
import { HomeFeedEvent  } from '@/data/home-feed';
//need to import because react - native starts with nothing
const IMG = {     //images needed                                                                                                
    p1: require('@/assets/images/figma-home/home-avatar-1.png'),
    p2: require('@/assets/images/figma-home/home-avatar-2.png'),                                                    
    p3: require('@/assets/images/figma-home/home-avatar-3.png'),   
    header: require('@/assets/images/figma-home/home-card-2.png')                                                 
};
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
  'November', 'December'];                                                                                        
const dow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];                                                                  
const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
                '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', 
                '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', 
]

type CalendarPanelProps = {
  event: HomeFeedEvent;
  onSendToPoll: () => void;
};



// function parseBlock(label: string, timeRange: string) {
//   const dayMap: Record<string, number> = {
//     sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
//     thursday: 4, friday: 5, saturday: 6,
//   };
//   const dayName = label.split(',')[0].trim().toLowerCase();
//   const col = dayMap[dayName] ?? -1;

//   const parseHour = (s: string) => {
//     const isPM = s.toLowerCase().includes('pm');
//     const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
//     if (isPM && n !== 12) return n + 12;
//     if (!isPM && n === 12) return 0;
//     return n;
//   };
//   const [startStr, endStr] = timeRange.split('-');
//   const suffix = endStr.toLowerCase().includes('am') ? 'AM' : 'PM';
//   const startHour = parseHour(startStr.includes('M') ? startStr : startStr + suffix);
//   const endHour = parseHour(endStr);

//   const top = (startHour - 8) * ROW_H;
//   const height = (endHour - startHour) * ROW_H;
//   return { col, top, height };
// }

export function CalendarPanel({ event, onSendToPoll }: CalendarPanelProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    event.calendar.selectedOptionId ?? event.calendar.options[0]?.id,
  );

    const [week, changeWeek] = useState(0);

    const now = new Date();                                                                                           
    const day_of_month = now.getDate();                                                                               
    const curr_month = now.getMonth();                                                                                
    const day_of_week = now.getDay();
    const day_nums = Array.from({length: 7}, (_, i) => {                                                              
    const d = new Date(now);
    d.setDate(day_of_month - day_of_week + i + week * 7);                                                                    
    return d.getDate();
}); 
    const weekStart = new Date(now);                                                                                  
    weekStart.setDate(day_of_month - day_of_week + week * 7);
    const new_month = weekStart.getMonth();                                                                           
    const year = weekStart.getFullYear();

  return (
     <View style = {styles.safeview}>
                <View style = {styles.calendar}>
                    <View style = {styles.monthHeader}>
                        <Text style = {{
                            flex: 147,
                            fontSize: 18, 
                            fontFamily: 'Montserrat', 
                            fontWeight: '600', 
                            lineHeight: 23.40, 
                            wordWrap: 'break-word'}}
                        >
                            {`${months[new_month]} ${year}`}
                        </Text>
                        <Pressable onPress={() => changeWeek(week-1)}>
                            <Ionicons name = "chevron-back" size = {28}/>
                        </Pressable>
                        <Pressable onPress={() => changeWeek(week+1)}>
                            <Ionicons name = "chevron-forward" size = {28}/>
                        </Pressable>
                    </View>
                    <View style = {styles.dateHeader}>
                        <View style = {{
                            flex: 64,
                            backgroundColor: '#ffffff'
                        }}/>
                        <View style = {{
                            flex: 338,
                            flexDirection: 'row',
                            paddingTop: 8,
                            paddingRight: 8,
                            justifyContent: 'space-between',
                            alignContent: 'center',
                        }}>
                            {day_nums.map((day, index) => {
                                const isToday = week ===0 && index === day_of_week;
                                return(
                                <View key={index} style = {{
                                    width: 40,
                                    alignItems: 'center',

                                }}>                                                                                       
                                    <Text style = {{color: '#878787', fontSize: 12, fontFamily: 'DM Sans', fontWeight: '400', lineHeight: 18, wordWrap: 'break-word',
                                    // paddingHorizontal: 8
                                    }}>
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
                        <ScrollView style = {{
                            flex: 1,

                        }}
                        showsVerticalScrollIndicator = {false}
                        >
                            
                                {hours.map((hour, index) => (
                                    <View key = {index} style = {{flexDirection: 'row'}}>
                                        <View style = {styles.hourbox}>
                                            <Text style = {{color: '#878787', fontSize: 12, fontFamily: 'DM Sans', fontWeight: '400', lineHeight: 18, wordWrap: 'break-word'}}>{hour}</Text>
                                        </View>
                                        {day_nums.map((day,index) => (
                                            <View key = {index} style = {{
                                                width: 48.3, 
                                                borderLeftWidth: 1,
                                                borderLeftColor: '#dbdbdb',          
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#dbdbdb',
                                            }}>

                                            </View>
                                        )
                                        )}
                                    </View>
                                    
                                )
                            )}
                        </ScrollView>
                    </View>
                </View>
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
                            fontSize: 28.83, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: 37.48, wordWrap: 'break-word',
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
                        <View style = {styles.optionbox}>
                            <View style = {styles.addOption}>
                                <Text style = {{color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: 20.80, wordWrap: 'break-word', paddingTop: 6
    }}> 
                                    Add Option
                                </Text>
                                <Pressable style={styles.button}>                                                                                                        
                                    <Ionicons name="add" size={20} color="#131313" />
                                </Pressable>    
                            </View>
                            <View style = {styles.addOption}>
                                <Text style = {{color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: 20.80, wordWrap: 'break-word', paddingTop: 6
    }}> 
                                    Add Option
                                </Text>
                                <Pressable style={styles.button}>                                                                                                        
                                    <Ionicons name="add" size={20} color="#131313" />
                                </Pressable>    
                            </View>
                            <View style = {styles.addOption}>
                                <Text style = {{color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: 20.80, wordWrap: 'break-word', paddingTop: 6
    }}> 
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
                            <Pressable style = {{
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
                                    fontSize: 14, fontFamily: 'DM Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word', color: '#131313'
                                }}>
                                    Send to Poll
                                </Text>
                            </Pressable>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
  );
}

const styles = StyleSheet.create({
    safeview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,                  
    borderTopRightRadius: 20,  
    },
    //823 vertical flex
    header:{
        flex: 215,
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
        paddingTop: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    calendar:{
        flex: 626,
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        borderTopLeftRadius: 20,                                                                                          
        borderTopRightRadius: 20,
    },
    arrow:{
        width: '100%',
        paddingBottom: 6,
    },
    title:{
        fontSize: 28.83,
        fontFamily: 'Montserrat',
        fontWeight: 600,
        lineHeight: 37.48, 
        wordWrap: 'break-word',
        paddingBottom: 16,
    },
    profiles:{
        paddingBottom: 8,
    },
    monthHeader:{
        flex: 72,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 24,
        // paddingVertical: 24,
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
    times:{
        flex: 476,
    },
    circle: {                                                                                                         
      backgroundColor: '#8CB3D4',
      borderRadius: 50,       
    },     
    hourbox: {
        flex: 64,
        height: 59,
        paddingTop: 9,
        paddingLeft: 8,
        paddingBottom: 32,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
    },
    circledSingle: {
        fontSize: 17, 
        fontFamily: 'Montserrat', 
        fontWeight: '600', 
        lineHeight: 23.40, 
        wordWrap: 'break-word',
        paddingHorizontal: 9,
        paddingVertical: 4.5,
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
        justifyContent: 'space-between'
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
        left: 130
    }

})
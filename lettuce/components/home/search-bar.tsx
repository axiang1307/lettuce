import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

type SearchBarProps = {
  /** Current search text — filters home feed */
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/**
 * Home search: filters events by substring (title, details, group, description).
 */
export function SearchBar({ value, onChangeText, placeholder = 'Search events' }: SearchBarProps) {
  return (
    <View style={styles.shell}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#878787"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search events"
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={12}
          style={styles.clearBtn}
          onPress={() => onChangeText('')}>
          <MaterialIcons name="close" size={22} color="#878787" />
        </Pressable>
      ) : null}
      <View style={styles.searchIcon} pointerEvents="none">
        <MaterialIcons name="search" size={26} color="#878787" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingLeft: 16,
    paddingRight: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    color: '#131313',
    paddingVertical: 12,
    paddingRight: 8,
  },
  clearBtn: {
    padding: 4,
    marginRight: 4,
  },
  searchIcon: {
    paddingLeft: 4,
  },
});

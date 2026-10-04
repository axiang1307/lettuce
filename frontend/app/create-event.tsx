import { HomeLogo } from '@/components/home/home-logo';
import { OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { Colors, OnboardingFontFamily } from '@/constants/theme';
import { eventsRepo } from '@/lib/repositories/events';
import { groupsRepo, type Group } from '@/lib/repositories/groups';
import { MaterialIcons } from '@expo/vector-icons';
import { Href, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Fields mirror the `events` columns a creator sets; time is picked later via polls.
// Every event belongs to one group, so the creator picks one of their groups first.
export default function CreateEventScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // set when opened from a group card's "Plan Event" button
  const params = useLocalSearchParams<{ groupId?: string }>();

  const [groups, setGroups] = useState<Group[] | null>(null);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(params.groupId ?? null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadGroups = useCallback(() => {
    groupsRepo.getGroups()
      .then((mine) => {
        setGroups(mine);
        setGroupsError(null);
        // keep the current pick if it still exists; preselect when there's only one choice
        setGroupId((current) =>
          current && mine.some((g) => g.id === current) ? current : mine.length === 1 ? mine[0].id : null
        );
      })
      .catch((err: Error) => setGroupsError(err.message));
  }, []);

  // Refetch on focus so a group created from the empty state shows up on return.
  useFocusEffect(loadGroups);

  const isValid = groupId !== null && title.trim().length > 0;

  const handleCreate = async () => {
    if (!groupId || !isValid || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await eventsRepo.create({
        group_id: groupId,
        title: title.trim(),
        description: description.trim() || null,
        final_location: location.trim() || null,
      });
      router.back();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSaving(false);
    }
  };

  const goCreateGroup = () => router.push('/create-group' as Href);

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.container, { paddingTop: insets.top + 10 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrap}>
            <HomeLogo />
          </View>

          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
              hitSlop={12}>
              <MaterialIcons name="arrow-back" size={24} color="#131313" />
            </Pressable>
            <Text style={styles.title}>Create Event</Text>
            <View style={styles.backButton} />
          </View>

          {groupsError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{groupsError}</Text>
              <Pressable onPress={loadGroups} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
                <Text style={styles.linkText}>Try again</Text>
              </Pressable>
            </View>
          ) : groups === null ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.light.tint} />
            </View>
          ) : groups.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>Events live inside a group. Create a group first, then plan something with it.</Text>
              <Pressable onPress={goCreateGroup} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
                <Text style={styles.linkText}>Create a group</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Group</Text>
                  <View style={styles.groupList}>
                    {groups.map((group) => {
                      const selected = group.id === groupId;
                      return (
                        <Pressable
                          key={group.id}
                          onPress={() => setGroupId(group.id)}
                          disabled={isSaving}
                          style={({ pressed }) => [
                            styles.groupRow,
                            selected && styles.groupRowSelected,
                            pressed && { opacity: 0.85 },
                          ]}>
                          <Text style={styles.groupName} numberOfLines={1}>
                            {group.name}
                          </Text>
                          <MaterialIcons
                            name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                            size={22}
                            color={selected ? Colors.light.tint : '#b6b6b6'}
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="What are you planning?"
                    placeholderTextColor={Colors.light.onboarding.disabledText}
                    editable={!isSaving}
                    style={styles.input}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add some details (optional)"
                    placeholderTextColor={Colors.light.onboarding.disabledText}
                    multiline
                    editable={!isSaving}
                    style={[styles.input, styles.multiline]}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Where? (optional)"
                    placeholderTextColor={Colors.light.onboarding.disabledText}
                    editable={!isSaving}
                    style={styles.input}
                  />
                </View>
              </View>

              {saveError && <Text style={styles.errorText}>{saveError}</Text>}

              <OnboardingPrimaryButton
                label={isSaving ? 'Creating…' : 'Create Event'}
                disabled={!isValid || isSaving}
                onPress={handleCreate}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 88,
    gap: 24,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: '#131313',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#131313',
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    color: Colors.light.onboarding.title,
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    height: 48,
    lineHeight: 21,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  multiline: {
    height: 112,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#878787',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  linkText: {
    color: Colors.light.tint,
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#D9534F',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  groupList: {
    gap: 8,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    backgroundColor: '#ffffff',
  },
  groupRowSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: '#f4f7ea',
  },
  groupName: {
    flex: 1,
    color: '#131313',
    fontFamily: OnboardingFontFamily.bodySemibold,
    fontSize: 14,
    lineHeight: 21,
  },
});

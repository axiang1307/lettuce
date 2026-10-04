import { HomeLogo } from '@/components/home/home-logo';
import { OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { Colors, OnboardingFontFamily } from '@/constants/theme';
import { groupsRepo } from '@/lib/repositories/groups';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

// POST /groups makes the caller the group's owner.
export default function CreateGroupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isValid = name.trim().length > 0;

  const handleCreate = async () => {
    if (!isValid || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await groupsRepo.create({ name: name.trim(), description: description.trim() || null });
      router.back();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSaving(false);
    }
  };

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
            <Text style={styles.title}>Create Group</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="What's this group called?"
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
                placeholder="What's it for? (optional)"
                placeholderTextColor={Colors.light.onboarding.disabledText}
                multiline
                editable={!isSaving}
                style={[styles.input, styles.multiline]}
              />
            </View>
          </View>

          {saveError && <Text style={styles.errorText}>{saveError}</Text>}

          <OnboardingPrimaryButton
            label={isSaving ? 'Creating…' : 'Create Group'}
            disabled={!isValid || isSaving}
            onPress={handleCreate}
          />
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
  errorText: {
    color: '#D9534F',
    fontFamily: OnboardingFontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});

import { HomeLogo } from '@/components/home/home-logo';
import { OnboardingPrimaryButton } from '@/components/onboarding/OnboardingButtons';
import { Colors, OnboardingFontFamily } from '@/constants/theme';
import { avatarsRepo } from '@/lib/repositories/avatars';
import { profilesRepo, type Profile, type ProfileUpdate } from '@/lib/repositories/profiles';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

const DEFAULT_AVATAR = require('@/assets/images/figma-profile/profile-avatar-default.png');

// profiles stores a single full_name; onboarding writes it as "<first> <last>".
const splitName = (fullName: string | null) => {
  const trimmed = (fullName ?? '').trim();
  const space = trimmed.indexOf(' ');
  return space === -1 ? [trimmed, ''] : [trimmed.slice(0, space), trimmed.slice(space + 1).trim()];
};

type PickedPhoto = { uri: string; base64: string; mimeType?: string };

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = () => {
    profilesRepo.getMe()
      .then((me) => {
        const [first, last] = splitName(me.full_name);
        setProfile(me);
        setFirstName(first);
        setLastName(last);
        setUsername(me.username ?? '');
      })
      .catch((err: Error) => setLoadError(err.message));
  };

  useEffect(load, []);

  // Only send fields that actually changed (PATCH semantics).
  const buildUpdate = (): ProfileUpdate => {
    if (!profile) return {};
    const update: ProfileUpdate = {};
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (fullName !== (profile.full_name ?? '')) update.full_name = fullName;
    const nextUsername = username.trim() || null;
    if (nextUsername !== profile.username) update.username = nextUsername;
    if (removePhoto && profile.avatar_url) update.avatar_url = null;
    return update;
  };

  const hasChanges = photo !== null || Object.keys(buildUpdate()).length > 0;
  const isValid = firstName.trim().length > 0;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Error', 'Could not read that photo. Please try another one.');
      return;
    }
    setPhoto({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType });
    setRemovePhoto(false);
  };

  const onAvatarPress = () => {
    const hasPhoto = photo !== null || (!!profile?.avatar_url && !removePhoto);
    if (!hasPhoto) {
      void pickPhoto();
      return;
    }
    Alert.alert('Profile photo', undefined, [
      { text: 'Choose from library', onPress: () => void pickPhoto() },
      {
        text: 'Remove photo',
        style: 'destructive',
        onPress: () => {
          setPhoto(null);
          setRemovePhoto(true);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!profile || !isValid || !hasChanges || isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    const update = buildUpdate();
    let uploadedPath: string | null = null;
    try {
      if (photo) {
        uploadedPath = await avatarsRepo.upload(photo.base64, photo.mimeType);
        update.avatar_url = uploadedPath;
      }
      await profilesRepo.patchMe(update);
    } catch (err) {
      // Don't leave an orphaned upload behind if the profile update failed.
      if (uploadedPath) avatarsRepo.remove(uploadedPath).catch(() => {});
      setSaveError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSaving(false);
      return;
    }

    // The old file is no longer referenced; cleanup is best-effort.
    if ('avatar_url' in update && profile.avatar_url) {
      avatarsRepo.remove(profile.avatar_url).catch(() => {});
    }
    router.back();
  };

  const avatarSource = photo
    ? { uri: photo.uri }
    : profile?.avatar_url && !removePhoto
      ? { uri: avatarsRepo.publicUrl(profile.avatar_url) }
      : DEFAULT_AVATAR;

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
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.backButton} />
          </View>

          {loadError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{loadError}</Text>
              <Pressable
                onPress={() => {
                  setLoadError(null);
                  load();
                }}
                style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
                <Text style={styles.linkText}>Try again</Text>
              </Pressable>
            </View>
          ) : !profile ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.light.tint} />
            </View>
          ) : (
            <>
              <Pressable
                onPress={onAvatarPress}
                disabled={isSaving}
                style={({ pressed }) => [styles.avatarSection, pressed && { opacity: 0.85 }]}>
                <View style={styles.avatarWrap}>
                  <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
                </View>
                <Text style={styles.linkText}>Change photo</Text>
              </Pressable>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor={Colors.light.onboarding.disabledText}
                    textContentType="givenName"
                    editable={!isSaving}
                    style={styles.input}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor={Colors.light.onboarding.disabledText}
                    textContentType="familyName"
                    editable={!isSaving}
                    style={styles.input}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor={Colors.light.onboarding.disabledText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="username"
                    editable={!isSaving}
                    style={styles.input}
                  />
                </View>
              </View>

              {saveError && <Text style={styles.errorText}>{saveError}</Text>}

              <OnboardingPrimaryButton
                label={isSaving ? 'Saving…' : 'Save'}
                disabled={!isValid || !hasChanges || isSaving}
                onPress={handleSave}
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
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#cecece',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: '100%',
    height: '100%',
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
});

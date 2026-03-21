import { Href, Redirect } from 'expo-router';

/**
 * App entry: sends users into the onboarding → login → tabs flow.
 *
 * PLACEHOLDER DEV SHORTCUT: flip to `true` to jump straight to main tabs while building UI
 * (no persistence — cold start always runs this file).
 */
const SKIP_ONBOARDING_AND_LOGIN = false;

export default function Index() {
  if (SKIP_ONBOARDING_AND_LOGIN) {
    return <Redirect href={'/(tabs)' as Href} />;
  }
  return <Redirect href={'/onboarding' as Href} />;
}

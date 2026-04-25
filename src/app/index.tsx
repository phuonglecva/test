import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function IndexRoute() {
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);
  const authToken = useAppStore((state) => state.authToken);

  if (!authToken) {
    return <Redirect href="/sign-in" />;
  }

  return hasSeenOnboarding ? <Redirect href="/home" /> : <Redirect href="/onboarding" />;
}

import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function IndexRoute() {
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);

  return hasSeenOnboarding ? <Redirect href="/home" /> : <Redirect href="/onboarding" />;
}

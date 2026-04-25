import type { ExpoConfig, ConfigContext } from 'expo/config';

const APP_NAME = 'Gym Buddy';
const APP_SLUG = 'gym-buddy';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: APP_SLUG,
  scheme: 'gymbuddy',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  jsEngine: 'hermes',
  platforms: ['ios', 'android', 'web'],
  icon: './dataset/images/0025-EIeI8Vf.jpg',
  splash: {
    backgroundColor: '#0F0F0F',
    resizeMode: 'contain',
    image: './dataset/images/0451-Y5X65IB.jpg'
  },
  assetBundlePatterns: ['dataset/**/*'],
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0F0F0F',
        image: './dataset/images/0451-Y5X65IB.jpg',
        imageWidth: 220
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.gymbuddy.app',
    associatedDomains: ['applinks:gymbuddy.app']
  },
  android: {
    package: 'com.gymbuddy.app',
    adaptiveIcon: {
      backgroundColor: '#0F0F0F',
      foregroundImage: './dataset/images/0025-EIeI8Vf.jpg'
    }
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './dataset/images/0025-EIeI8Vf.jpg'
  },
  extra: {
    appName: APP_NAME,
    appSlug: APP_SLUG,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? ''
    }
  }
});

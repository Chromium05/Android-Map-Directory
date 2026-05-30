import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as Linking from 'expo-linking';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

// Belt-and-suspenders: also called on auth/callback.tsx (required on the redirect page)
WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync();

function RouteGuard() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Android: Chrome Custom Tab cannot redirect to exp:// or custom schemes.
  // Instead it keeps the tab open and activates the app via the Android intent
  // system. We catch the URL here, dismiss the stuck tab, then exchange the code.
  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (!url.includes('auth/callback') || !url.includes('code=')) return;
      console.log('[RouteGuard] deep link received:', url);
      // Dismiss the Chrome Custom Tab that is still open in the foreground
      await WebBrowser.dismissBrowser();
      await supabase.auth.exchangeCodeForSession(url);
    };

    // Cold start: app was launched by the deep link
    Linking.getInitialURL().then((url) => { if (url) handleUrl(url); });

    // Warm start: app already running when deep link arrived
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  // Route guard: unauthenticated users → /login, authenticated on auth screens → /
  useEffect(() => {
    if (loading) return;
    const seg = segments[0] as string;
    // 'auth' covers /auth/callback; allow it unauthenticated so the exchange can complete
    const onAuthScreen = seg === 'login' || seg === 'register' || seg === 'auth';
    if (!session && !onAuthScreen) {
      router.replace('/login');
    } else if (session && onAuthScreen) {
      router.replace('/');
    }
  }, [session, loading, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RouteGuard />
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="unit/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="auth/callback" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}

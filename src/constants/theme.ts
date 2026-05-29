/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1c2520', // --ink
    background: '#fcfaf6', // --paper
    backgroundElement: '#f5f1eb', // --paper-2
    backgroundSelected: '#ece6dd', // --paper-3
    textSecondary: '#4d5751', // --ink-2
    hairline: '#e0d9cf',
    hairline2: '#cdc3b5',
    ink3: '#838c87',
    route: '#1ba775',
    routeInk: '#1c5a40',
    routeTint: '#dff5e9',
    open: '#1ba775',
    warning: '#d99a3a',
    closed: '#c2553d',
  },
  dark: {
    text: '#fcfaf6',
    background: '#1c2520',
    backgroundElement: '#252e29',
    backgroundSelected: '#2e3732',
    textSecondary: '#838c87',
    hairline: '#2e3732',
    hairline2: '#3d4641',
    ink3: '#4d5751',
    route: '#1ba775',
    routeInk: '#dff5e9',
    routeTint: '#1c5a40',
    open: '#1ba775',
    warning: '#d99a3a',
    closed: '#c2553d',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Weight-specific font families. React Native does not synthesize weights from a
 * single family on Android, so each weight maps to the matching loaded font face
 * (see `@expo-google-fonts/*`, loaded in `src/app/_layout.tsx`).
 */
export const Font = {
  sans: {
    '400': 'PlusJakartaSans_400Regular',
    '500': 'PlusJakartaSans_500Medium',
    '600': 'PlusJakartaSans_600SemiBold',
    '700': 'PlusJakartaSans_700Bold',
    '800': 'PlusJakartaSans_800ExtraBold',
  },
  mono: {
    '400': 'JetBrainsMono_400Regular',
    '500': 'JetBrainsMono_500Medium',
    '600': 'JetBrainsMono_600SemiBold',
    '700': 'JetBrainsMono_700Bold',
  },
} as const;

export type SansWeight = keyof typeof Font.sans;
export type MonoWeight = keyof typeof Font.mono;

/** Legacy single-family handles (kept for back-compat); prefer `Font` above. */
export const Fonts = Platform.select({
  ios: {
    sans: Font.sans['400'],
    mono: Font.mono['400'],
  },
  default: {
    sans: Font.sans['400'],
    mono: Font.mono['400'],
  },
});

export const Spacing = {
  zero: 0,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  eight: 32,
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

import { useColorScheme } from 'react-native';

const palette = {
  emerald900: '#064E3B', // Deep Luxury Green
  emerald700: '#047857', // Primary Green
  emerald500: '#10B981', // Bright Green
  emerald300: '#6EE7B7', // Soft Green
  sand50: '#F9F9F7',     // Premium Paper Background
  sand100: '#F0EFE9',    // Secondary Background
  slate900: '#0F172A',   // Dark Background
  slate800: '#1E293B',   // Dark Surface
  slate400: '#94A3B8',
  white: '#FFFFFF',
  gold: '#F59E0B',       // Luxury Accent
};

export const lightTheme = {
  background: palette.sand50,
  surface: palette.white,
  surfaceSecondary: palette.sand100,
  text: '#1C1917',       // Warm Black
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: palette.emerald900,
  primaryLight: palette.emerald700,
  secondary: '#78716c',
  accent: palette.gold,
  error: '#EF4444',
  success: palette.emerald700,
  warning: palette.gold,
  border: '#E5E7EB',
  shadow: 'rgba(6, 78, 59, 0.08)', // Colored shadow
  cardBackground: palette.white,
  shimmer: '#E5E7EB',
};

export const darkTheme = {
  background: palette.slate900,
  surface: palette.slate800,
  surfaceSecondary: '#334155',
  text: palette.sand50,
  textSecondary: palette.slate400,
  textTertiary: '#64748B',
  primary: palette.emerald300,
  primaryLight: palette.emerald500,
  secondary: palette.slate400,
  accent: palette.gold,
  error: '#F87171',
  success: palette.emerald500,
  warning: palette.gold,
  border: '#334155',
  shadow: 'rgba(0, 0, 0, 0.4)',
  cardBackground: palette.slate800,
  shimmer: '#334155',
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export default {
  light: lightTheme,
  dark: darkTheme,
  useThemeColors,
};

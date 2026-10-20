export type ThemeMode = 'light' | 'dark';

export const LightThemeColors = {
  bg: '#f4f0e8',
  surface: '#fffdf8',
  surfaceMuted: '#ebe6db',
  overlay: 'rgba(26, 35, 48, 0.45)',

  text: '#1a2330',
  textMuted: '#5c574e',
  textInverse: '#f7f3ea',

  primary: '#1b4b73',
  primaryHover: '#143858',
  primarySoft: 'rgba(27, 75, 115, 0.12)',
  onPrimary: '#fffdf8',

  accent: '#a65d1e',
  accentSoft: 'rgba(166, 93, 30, 0.14)',

  border: '#ddd4c6',
  borderStrong: '#c4b8a6',

  success: '#2f6f4e',
  successSoft: 'rgba(47, 111, 78, 0.12)',
  warning: '#a65d1e',
  danger: '#9b2c2c',
  dangerSoft: 'rgba(155, 44, 44, 0.12)',
  focus: '#1b4b73',

  card: '#fffdf8',
  inputBg: '#fffdf8',
};

export const DarkThemeColors = {
  bg: '#12161d',
  surface: '#1c232e',
  surfaceMuted: '#161c26',
  overlay: 'rgba(8, 10, 14, 0.62)',

  text: '#ede6d9',
  textMuted: '#b3aa9c',
  textInverse: '#12161d',

  primary: '#8bb4d4',
  primaryHover: '#a7c8e0',
  primarySoft: 'rgba(139, 180, 212, 0.16)',
  onPrimary: '#12161d',

  accent: '#d4a373',
  accentSoft: 'rgba(212, 163, 115, 0.16)',

  border: '#2c3544',
  borderStrong: '#3d4a5c',

  success: '#7dcea0',
  successSoft: 'rgba(125, 206, 160, 0.14)',
  warning: '#d4a373',
  danger: '#e08080',
  dangerSoft: 'rgba(224, 128, 128, 0.14)',
  focus: '#8bb4d4',

  card: '#1c232e',
  inputBg: '#161c26',
};

export type ThemeColors = typeof LightThemeColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 9999,
};

export const Typography = {
  fontFamily: {
    serif: 'serif',
    sans: 'sans-serif',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 28,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.6,
  },
};

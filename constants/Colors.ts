/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2865D1';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#001533', // Dark Color
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#DDE6F2', // Light Color
    background: '#001533', // Dark Color used as background for dark mode
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
export const colors = {
  primary: {
    50: '#DDE6F2',
    100: '#bce4f5',
    200: '#99d9f7',
    300: '#76cef9',
    400: '#53c3fb',
    500: '#2865D1',
    600: '#2051a8',
    700: '#183d7f',
    800: '#102956',
    900: '#001533',
  },

  secondary: {
    50: '#f5f6f7',
    100: '#e6e7e9',
    200: '#cfd2d6',
    300: '#aab0b8',
    400: '#808996',
    500: '#5e6776',
    600: '#454d5a',
    700: '#333943',
    800: '#22262d',
    900: '#040811',
  },

  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#b9f8cf',
    300: '#7bf1a8',
    400: '#05df72',
    500: '#00c950',
    600: '#00a63e',
    700: '#008236',
    800: '#016630',
    900: '#0d542b',
  },

  warning: {
    50: '#fff7ed',
    100: '#ffedd4',
    200: '#ffd6a7',
    300: '#ffb86a',
    400: '#ff8904',
    500: '#ff6900',
    600: '#f54900',
    700: '#ca3500',
    800: '#9f2d00',
    900: '#7e2a0c'
  },

  error: {
    50: '#fef2f2',
    100: '#ffe2e2',
    200: '#ffc9c9',
    300: '#ffa2a2',
    400: '#ff6467',
    500: '#fb2c36',
    600: '#e7000b',
    700: '#c10007',
    800: '#9f0712',
    900: '#82181a'

  },

  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  white: '#FFFFFF',
  black: '#000000',
};
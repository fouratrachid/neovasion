import { ReactNode } from 'react';
import { LanguageOption, Locale } from '../types';

export interface I18nContextValue {
  currentLanguage: Locale;
  isRTL: boolean;
  isLoading: boolean;
  changeLanguage: (languageCode: Locale) => Promise<void>;
  getAvailableLanguages: () => LanguageOption[];
  RTL_LANGUAGES: readonly Locale[];
  needsRestart?: boolean;
  clearRestartFlag?: () => void;
}

export interface I18nProviderProps {
  children: ReactNode;
}

export interface LayoutStyles {
  row: { flexDirection: 'row' | 'row-reverse' };
  column: { flexDirection: 'column' };
  textLeft: { textAlign: 'left' | 'right' };
  textRight: { textAlign: 'left' | 'right' };
  textCenter: { textAlign: 'center' };
  marginStart: (value: number) => { marginLeft: number } | { marginRight: number };
  marginEnd: (value: number) => { marginLeft: number } | { marginRight: number };
  paddingStart: (value: number) => { paddingLeft: number } | { paddingRight: number };
  paddingEnd: (value: number) => { paddingLeft: number } | { paddingRight: number };
  start: (value: number) => { left: number } | { right: number };
  end: (value: number) => { left: number } | { right: number };
  flipHorizontal: { transform: [{ scaleX: number }] };
}
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { Locale } from '../types';

export interface BaseComponentProps {
  children?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}


export interface LanguageSelectorProps extends BaseComponentProps {
  currentLanguage: Locale;
  onLanguageChange: (language: Locale) => void;
  disabled?: boolean;
}

export interface RTLTextProps extends BaseComponentProps {
  numberOfLines?: number;
}
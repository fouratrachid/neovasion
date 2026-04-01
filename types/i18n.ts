import { Locale, TextDirection } from './common';

export interface LanguageOption {
  code: Locale;
  name: string;
  nativeName: string;
  direction: TextDirection;
}

export interface TranslationResources {
  en: { translation: Record<string, string> };
  fr: { translation: Record<string, string> };
}

export interface I18nState {
  currentLanguage: Locale;
  isRTL: boolean;
  availableLanguages: LanguageOption[];
  isLoading: boolean;
}
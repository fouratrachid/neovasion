import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

// Import translation files
import { default as ar, default as generalAr } from '../../locales/ar.json';
import authAr from '../../locales/auth/ar.json';
import authEn from '../../locales/auth/en.json';
import authFr from '../../locales/auth/fr.json';
import { default as en, default as generalEn } from '../../locales/en.json';
import { default as fr, default as generalFr } from '../../locales/fr.json';
import homeAr from '../../locales/home/ar.json';
import homeEn from '../../locales/home/en.json';
import homeFr from '../../locales/home/fr.json';
import profileAr from '../../locales/profile/ar.json';
import profileEn from '../../locales/profile/en.json';
import profileFr from '../../locales/profile/fr.json';
// Define the resources
const resources = {
  en: {
    translation: generalEn,
    auth: authEn,
    home: homeEn,

  },
  fr: {
    translation: generalFr,
    auth: authFr,
    home: homeFr,
    profile: profileFr,

  },
  ar: {
    translation: generalAr,
    auth: authAr,
    home: homeAr,
  },
};

// RTL languages
const RTL_LANGUAGES = ['ar'];
const LANGUAGE_STORAGE_KEY = 'user_language';

const initI18n = async () => {
  // Load saved language from AsyncStorage
  let savedLanguage: string | null = null;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    console.log('🔍 InitI18n - Saved language from storage:', savedLanguage);
  } catch (error) {
    console.log('Error loading saved language in initI18n:', error);
  }

  // Use saved language if exists, otherwise device locale
  const currentLocale = savedLanguage || Localization.getLocales()[0].languageCode || 'en';
  const isRTL = RTL_LANGUAGES.includes(currentLocale);

  console.log('🌍 InitI18n - Using locale:', currentLocale, 'RTL:', isRTL);

  // Do NOT call I18nManager.forceRTL - we handle RTL manually in useRTLLayout
  // Calling forceRTL causes Yoga to double-reverse our manual row-reverse styles
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: resources[currentLocale] ? currentLocale : 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  console.log('✅ I18n initialized with language:', i18n.language);
};

export { initI18n };
export default i18n;
import type { I18nContextValue, I18nProviderProps } from "@/interfaces/context";
import type { Locale } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Platform } from "react-native";

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const RTL_LANGUAGES: readonly Locale[] = ["ar"] as const;
const LANGUAGE_STORAGE_KEY = "user_language" as const;

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  // Initialize from i18n.language which was set in initI18n
  const [isRTL, setIsRTL] = useState<boolean>(
    RTL_LANGUAGES.includes(i18n.language as Locale),
  );
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(
    i18n.language as Locale,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const currentIsRTL = RTL_LANGUAGES.includes(i18n.language as Locale);
    console.log(
      "🎯 I18nProvider mounted - i18n.language:",
      i18n.language,
      "I18nManager.isRTL:",
      I18nManager.isRTL,
      "State isRTL:",
      isRTL,
      "Calculated isRTL:",
      currentIsRTL,
    );

    // Ensure state is synced with i18n.language
    if (currentIsRTL !== isRTL) {
      console.log("⚠️ RTL state mismatch, correcting to:", currentIsRTL);
      setIsRTL(currentIsRTL);
    }
    if (i18n.language !== currentLanguage) {
      setCurrentLanguage(i18n.language as Locale);
    }

    // Just sync notification language
  }, []);

  const changeLanguage = async (languageCode: Locale): Promise<void> => {
    try {
      setIsLoading(true);
      const isNewLanguageRTL = RTL_LANGUAGES.includes(languageCode);
      const requiresReload = isNewLanguageRTL !== isRTL;

      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

      if (requiresReload) {
        console.log(
          "🔄 RTL direction changed, reloading app (no I18nManager.forceRTL)",
        );
        // Do NOT call I18nManager.forceRTL - it causes Yoga to double-reverse our styles
        if (Platform.OS !== "web") {
          await Updates.reloadAsync();
        }
        return;
      }

      // Same RTL direction, just update language
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      setIsRTL(isNewLanguageRTL);
    } catch (error) {
      console.log("Error changing language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableLanguages = () => [
    {
      code: "en" as const,
      name: "English",
      nativeName: "English",
      direction: "ltr" as const,
    },
    {
      code: "fr" as const,
      name: "French",
      nativeName: "Français",
      direction: "ltr" as const,
    },
    {
      code: "ar" as const,
      name: "Arabic",
      nativeName: "العربية",
      direction: "rtl" as const,
    },
  ];

  const value: I18nContextValue = {
    currentLanguage,
    isRTL,
    isLoading,
    changeLanguage,
    getAvailableLanguages,
    RTL_LANGUAGES,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18nContext = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within an I18nProvider");
  }
  return context;
};

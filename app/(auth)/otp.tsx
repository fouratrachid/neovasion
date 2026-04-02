import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageModal } from "@/components/common/LanguageModal";
import { useI18nContext } from "@/contexts/I18nContext";

export default function OtpScreen() {
  const { t } = useTranslation("auth");
  const { email } = useLocalSearchParams<{ email: string }>();
  const colorScheme = useColorScheme();

  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Language
  const { currentLanguage, changeLanguage, getAvailableLanguages } =
    useI18nContext();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleVerify = async () => {};

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-dark-900"
      edges={["top", "bottom"]}
    >
      <StatusBar style="auto" />
      <View className="px-6 pt-4 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colorScheme === "dark" ? "#FFFFFF" : colors.neutral[900]}
            />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <ThemeToggle />
            <TouchableOpacity
              onPress={() => setShowLanguageModal(true)}
              className="flex-row items-center space-x-1"
            >
              <Text className="text-neutral-900 dark:text-white font-medium uppercase">
                {currentLanguage}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={colorScheme === "dark" ? "#FFFFFF" : colors.neutral[900]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 justify-center">
          <View className="mb-8 items-center">
            <Image
              source={
                colorScheme === "dark"
                  ? require("@/assets/images/logo-dark.png")
                  : require("@/assets/images/logo-light.png")
              }
              className="w-32 h-32 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {t("auth.otp.title") || "Check your email"}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-base">
              {t("auth.otp.subtitle") || "We sent an 8-character code to"}{" "}
              <Text className="font-bold text-neutral-800 dark:text-neutral-200">
                {email}
              </Text>
            </Text>
          </View>

          <View className="mb-8">
            <View className="flex-row items-center justify-center bg-neutral-50 dark:bg-dark-800 border border-neutral-200 dark:border-dark-700 rounded-2xl px-4 py-4">
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={(text) =>
                  setCode(
                    text
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 8),
                  )
                }
                placeholder={t("auth.otp.placeholder") || "ABC12345"}
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="characters"
                className="text-3xl font-bold text-center w-full text-neutral-900 dark:text-white tracking-[4px]"
                autoFocus
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleVerify}
            disabled={code.length !== 8}
            className={`rounded-full py-3.5 items-center shadow-lg ${code.length === 8 ? "bg-primary-500 shadow-primary-500/30" : "bg-neutral-300 dark:bg-dark-700 shadow-none"}`}
          ></TouchableOpacity>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-neutral-500 dark:text-neutral-400">
              {t("auth.otp.didntReceive") || "Didn't receive code?"}{" "}
            </Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-bold">
                {t("auth.otp.resend") || "Resend"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => changeLanguage(lang as any)}
        availableLanguages={getAvailableLanguages()}
      />
    </SafeAreaView>
  );
}

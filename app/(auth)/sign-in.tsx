import { LanguageModal } from "@/components/common/LanguageModal";
import { useI18nContext } from "@/contexts/I18nContext";
import { useAuthStore } from "@/stores/authStore";
import { useAlert } from "@/hooks/useAlert";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SignInScreen() {
  const { t } = useTranslation("auth");
  const { showAlert } = useAlert();
  const { sendOtp, isLoading } = useAuthStore();
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Language
  const { currentLanguage, changeLanguage, getAvailableLanguages } =
    useI18nContext();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setGeneralError("");

    if (!email) {
      setEmailError(t("auth.signIn.emailRequired") || "Email is required");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError(
          t("auth.signIn.invalidEmail") || "Please enter a valid email address",
        );
        isValid = false;
      }
    }

    return isValid;
  };

  const handleLogin = async () => {
    router.push({
      pathname: "/(tabs)/home",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-900">
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        {/* Top Bar */}
        <View className="pt-4 flex-row justify-between items-center mb-6">
          <View />
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
                className="text-neutral-900 dark:text-white"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 justify-center">
          {/* Logo Area */}
          <View className="items-center mb-12 mt-10">
            <Image
              source={
                colorScheme === "dark"
                  ? require("@/assets/images/logo-dark.png")
                  : require("@/assets/images/logo-light.png")
              }
              className="w-32 h-32 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 text-center">
              {t("auth.signIn.title") || "Welcome back"}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-center">
              {t("auth.signIn.subtitle") || "Enter your email to sign in"}
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-5 mb-8">
            {/* Email */}
            <View>
              <View className="flex-row items-center bg-neutral-50 dark:bg-dark-800 border border-neutral-200 dark:border-dark-700 rounded-2xl px-4 py-3.5">
                <Ionicons name="mail" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder={
                    t("auth.signIn.emailPlaceholder") || "Email address"
                  }
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-3 text-base text-neutral-900 dark:text-white font-medium"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
              {emailError ? (
                <Text className="text-error-500 text-xs mt-1 ml-1">
                  {emailError}
                </Text>
              ) : null}
            </View>

            {generalError ? (
              <Text className="text-error-500 text-center text-sm">
                {generalError}
              </Text>
            ) : null}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-primary-500 rounded-full py-3.5 items-center shadow-lg shadow-primary-500/30 mb-6"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                {t("auth.signIn.submit") || "Continue"}
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-neutral-500 dark:text-neutral-400">
              {t("auth.signIn.noAccount") || "Don't have an account?"}{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-primary-500 font-bold">
                {t("auth.signIn.signUpLink") || "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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

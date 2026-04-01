import { LanguageModal } from "@/components/common/LanguageModal";
import { useI18nContext } from "@/contexts/I18nContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { useRTLLayout } from "@/hooks/useRTLLayout";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SignUpScreen() {
  const { t } = useTranslation("auth");
  const { showAlert } = useAlert();
  const { sendOtp, isLoading } = useAuth();
  const { layoutStyles, isRTL } = useRTLLayout();
  const colorScheme = useColorScheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Language
  const { currentLanguage, changeLanguage, getAvailableLanguages } =
    useI18nContext();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const validateForm = () => {
    let errors: Record<string, string> = {};
    if (!firstName)
      errors.firstName = t("auth.signUp.nameRequired") || "First name required";
    if (!lastName)
      errors.lastName = t("auth.signUp.nameRequired") || "Last name required";
    if (!email)
      errors.email = t("auth.signUp.emailRequired") || "Email required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await sendOtp({
        FirstName: firstName,
        LastName: lastName,
        email,
      });

      router.push({
        pathname: "/(auth)/otp",
        params: { email },
      });
    } catch (err) {
      showAlert({
        title: t("auth.signUp.failedTitle") || "Sign Up Failed",
        message:
          err instanceof Error
            ? err.message
            : t("auth.signUp.errorCreating") || "Error creating account",
        icon: "alert-circle",
        iconColor: colors.error[500],
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-900">
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        {/* Header */}
        <View className="pt-4 flex-row justify-between items-center mb-6">
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
          {/* Title */}
          <View className="mb-6 items-center">
            <Image
              source={
                colorScheme === "dark"
                  ? require("@/assets/images/logo-dark.png")
                  : require("@/assets/images/logo-light.png")
              }
              className="w-32 h-32 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-2">
              {t("auth.signUp.title") || "Create Account"}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4 mb-6">
            {/* Split Name Fields */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <View
                  className={`flex-row items-center bg-neutral-50 dark:bg-dark-800 border rounded-2xl px-4 py-3.5 ${formErrors.firstName ? "border-error-500" : "border-neutral-200 dark:border-dark-700 focus:border-primary-500"}`}
                >
                  <TextInput
                    placeholder={
                      t("auth.signUp.firstNamePlaceholder") || "First Name"
                    }
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-base text-neutral-900 dark:text-white font-medium"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>
              <View className="flex-1">
                <View
                  className={`flex-row items-center bg-neutral-50 dark:bg-dark-800 border rounded-2xl px-4 py-3.5 ${formErrors.lastName ? "border-error-500" : "border-neutral-200 dark:border-dark-700 focus:border-primary-500"}`}
                >
                  <TextInput
                    placeholder={
                      t("auth.signUp.lastNamePlaceholder") || "Last Name"
                    }
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-base text-neutral-900 dark:text-white font-medium"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            <View>
              <View
                className={`flex-row items-center bg-neutral-50 dark:bg-dark-800 border rounded-2xl px-4 py-3.5 ${formErrors.email ? "border-error-500" : "border-neutral-200 dark:border-dark-700 focus:border-primary-500"}`}
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={formErrors.email ? colors.error[500] : "#9CA3AF"}
                />
                <TextInput
                  placeholder={t("auth.signUp.emailPlaceholder") || "Email"}
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-3 text-base text-neutral-900 dark:text-white font-medium"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="bg-primary-500 rounded-full py-3.5 items-center shadow-lg shadow-primary-500/30 mb-6"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                {t("auth.signUp.submit") || "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-neutral-500 dark:text-dark-300 mr-1">
              {t("auth.signUp.hasAccount") || "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-primary-500 font-bold">
                {t("auth.signUp.signIn") || "Sign in"}
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

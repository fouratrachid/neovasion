import { useRTLLayout } from "@/hooks/useRTLLayout";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (languageCode: string) => void;
  availableLanguages: { code: string; name: string }[];
}

export function LanguageModal({
  visible,
  onClose,
  currentLanguage,
  onSelectLanguage,
  availableLanguages,
}: Readonly<LanguageModalProps>) {
  const { t } = useTranslation("profile");
  const { layoutStyles } = useRTLLayout();

  const getLanguageNames = () => {
    const languageNamesMap: { [key: string]: { [key: string]: string } } = {
      en: { en: "English", fr: "French", ar: "Arabic" },
      fr: { en: "Anglais", fr: "Français", ar: "Arabe" },
      ar: { en: "الإنجليزية", fr: "الفرنسية", ar: "العربية" },
    };
    return languageNamesMap[currentLanguage] || languageNamesMap.en;
  };

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      en: "🇬🇧",
      fr: "🇫🇷",
      ar: "🇸🇦",
    };
    return flags[code] || "🌐";
  };

  const languageNames = getLanguageNames();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center px-6"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-4 border-b border-neutral-100">
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                layoutStyles.row,
              ]}
            >
              <View className="flex-1" style={layoutStyles.paddingEnd(12)}>
                <Text
                  className="text-xl font-bold text-neutral-900"
                  style={layoutStyles.textLeft}
                >
                  {t("profile.language.selectLanguage") || "Select Language"}
                </Text>
                <Text
                  className="text-sm text-neutral-500 mt-1"
                  style={layoutStyles.textLeft}
                >
                  {t("profile.language.choosePreferred") ||
                    "Choose your preferred language"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Language Options */}
          <View className="p-4">
            {availableLanguages.map((language) => {
              const isSelected = currentLanguage === language.code;

              return (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => onSelectLanguage(language.code)}
                  className={`rounded-2xl mb-3 ${
                    isSelected ? "bg-primary-100" : "bg-neutral-50"
                  }`}
                  activeOpacity={0.7}
                >
                  <View
                    className="p-4"
                    style={[
                      { flexDirection: "row", alignItems: "center" },
                      layoutStyles.row,
                    ]}
                  >
                    {/* Flag */}
                    <Text
                      className="text-3xl"
                      style={layoutStyles.marginEnd(16)}
                    >
                      {getLanguageFlag(language.code)}
                    </Text>

                    {/* Language Info */}
                    <View className="flex-1">
                      <Text
                        className={`text-base font-bold ${
                          isSelected ? "text-primary-600" : "text-neutral-900"
                        }`}
                        style={layoutStyles.textLeft}
                      >
                        {languageNames[language.code]}
                      </Text>
                    </View>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <View className="w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={colors.white}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

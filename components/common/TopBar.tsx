import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRTLLayout } from "@/hooks/useRTLLayout";
import ProfileDropDown from "./ProfileDropDown";

import { LanguageModal } from "@/components/common/LanguageModal";
import { useI18nContext } from "@/contexts/I18nContext";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showLogo?: boolean;
}

export const TopBar = ({
  title,
  showBack = false,
  onBackPress,
  showLogo = false,
}: TopBarProps) => {
  const { colorScheme } = useColorScheme();
  const { top } = useSafeAreaInsets();
  const { isRTL } = useRTLLayout();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { currentLanguage, changeLanguage, getAvailableLanguages } =
    useI18nContext();

  const handleProfilePress = () => {
    setShowProfileDropdown(true);
  };

  return (
    <>
      <View
        className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-dark-900"
        style={{ paddingTop: top + 10 }}
      >
        {/* Logo or Title */}
        {showLogo ? (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg items-center justify-center mr-2">
              <Image
                source={
                  colorScheme === "dark"
                    ? require("@/assets/images/test-dark.png")
                    : require("@/assets/images/test-light.png")
                }
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>
            <Text className="text-xl font-bold text-neutral-900 dark:text-white">
              Riwaq
            </Text>
          </View>
        ) : (
          <View
            className="flex-row items-center flex-1"
            style={isRTL ? { marginRight: 8 } : { marginLeft: 0 }}
          >
            {showBack && (
              <TouchableOpacity
                onPress={onBackPress || (() => router.back())}
                className="p-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isRTL ? "arrow-forward" : "arrow-back"}
                  size={24}
                  color={
                    colorScheme === "dark" ? colors.white : colors.neutral[900]
                  }
                />
              </TouchableOpacity>
            )}
            {title && (
              <Text
                className="text-xl font-bold text-neutral-900 dark:text-white flex-1 mx-2"
                numberOfLines={2}
              >
                {title}
              </Text>
            )}
          </View>
        )}

        {/* Action Icons */}
        <View className="flex-row items-center gap-3">
          {/* Search Button - Hidden for EventManager */}
          {/* {user?.role !== "EventManager" && (
            <TouchableOpacity
              onPress={() => router.push("/josoor-events")}
              className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-800 items-center justify-center"
            >
              <Ionicons
                name="search"
                size={20}
                color={
                  colorScheme === "dark" ? colors.white : colors.neutral[900]
                }
              />
            </TouchableOpacity>
          )} */}

          {/* Messages Button */}
          {/* <TouchableOpacity
            onPress={() => router.push("/messages")}
            className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-800 items-center justify-center"
          >
            <Ionicons
              name="chatbubbles-outline"
              size={20}
              color={
                colorScheme === "dark" ? colors.white : colors.neutral[900]
              }
            /> */}
          {/* Unread Messages Badge */}
          {/* {unreadMessagesCount > 0 && (
              <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary-500 rounded-full items-center justify-center px-1">
                <Text className="text-white text-[10px] font-bold">
                  {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                </Text>
              </View>
            )}
          </TouchableOpacity> */}

          {/* Theme Toggle 
          <TouchableOpacity
            onPress={toggleColorScheme}
            className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-800 items-center justify-center"
          >
            <Ionicons
              name={colorScheme === "dark" ? "sunny" : "moon"}
              size={20}
              color={
                colorScheme === "dark" ? colors.white : colors.neutral[900]
              }
            />
          </TouchableOpacity>
*/}

          {/* Profile Button */}
          <TouchableOpacity
            onPress={handleProfilePress}
            className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-800 items-center justify-center"
          >
            <Ionicons
              name="person-circle-outline"
              size={30}
              color={
                colorScheme === "dark" ? colors.white : colors.neutral[900]
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Dropdown */}
      <ProfileDropDown
        visible={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        anchorPosition={{ x: 0, y: top + 66 }}
        showJosoor={false}
        onPressJosoor={() => {}}
        onPressChangeLanguage={() => setShowLanguageModal(true)}
      />

      {/* Language Modal */}
      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(languageCode) => {
          changeLanguage(languageCode as any);
          setShowLanguageModal(false);
        }}
        availableLanguages={getAvailableLanguages()}
      />
    </>
  );
};

import { useI18nContext } from "@/contexts/I18nContext";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

type CustomTabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
  iconName: string;
  badgeCount?: number;
};

const CustomTabBarIcon = memo(
  ({
    focused,
    color,
    size,
    iconName,
    badgeCount = 0,
  }: CustomTabBarIconProps) => {
    const { isRTL } = useI18nContext();

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Ionicons
          name={iconName}
          size={focused ? size + 2 : size}
          color={color}
        />
        {badgeCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -4,
              backgroundColor: colors.error[500],
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 4,
              ...(isRTL ? { left: -6 } : { right: -6 }),
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 11,
                fontFamily: "AppBold",
              }}
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  },
);

CustomTabBarIcon.displayName = "CustomTabBarIcon";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { isRTL } = useI18nContext();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: "flex",
          borderTopWidth: 1,
          direction: isRTL ? "rtl" : "ltr",
          borderTopColor:
            colorScheme === "dark" ? colors.neutral[800] : colors.neutral[100],
          backgroundColor:
            colorScheme === "dark" ? colors.neutral[900] : colors.white,
          height: (Platform.OS === "ios" ? 60 : 58) + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          writingDirection: isRTL ? "rtl" : "ltr",

          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, focused, size }) => (
            <CustomTabBarIcon
              focused={focused}
              color={color}
              size={size}
              iconName={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

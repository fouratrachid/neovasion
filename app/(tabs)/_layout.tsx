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
  iconName: React.ComponentProps<typeof Ionicons>["name"];
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
    const iconContainerSize = focused ? 34 : 30;

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: iconContainerSize,
            height: iconContainerSize,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: focused
              ? "rgba(40, 101, 209, 0.16)"
              : "transparent",
          }}
        >
          <Ionicons
            name={iconName}
            size={focused ? size + 2 : size}
            color={color}
          />
        </View>
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
              marginTop: 10,
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
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: isDark
          ? colors.neutral[300]
          : colors.neutral[500],
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: "flex",
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 10,
          borderTopWidth: 0,
          borderWidth: 1,
          direction: isRTL ? "rtl" : "ltr",
          borderColor: isDark ? colors.neutral[700] : colors.primary[100],
          backgroundColor: isDark ? "#0F172A" : "#F8FBFF",
          height: (Platform.OS === "ios" ? 62 : 60) + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
          borderRadius: 24,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          writingDirection: isRTL ? "rtl" : "ltr",
          fontSize: 11,
          fontFamily: "AppSemiBold",
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home", { defaultValue: "Home" }),
          tabBarIcon: ({ color, focused, size }) => (
            <CustomTabBarIcon
              focused={focused}
              color={color}
              size={size}
              iconName={focused ? "compass" : "compass-outline"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="networking"
        options={{
          title: "Networking",
          tabBarIcon: ({ color, focused, size }) => (
            <CustomTabBarIcon
              focused={focused}
              color={color}
              size={size}
              iconName={focused ? "chatbubbles" : "chatbubbles-outline"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="templates"
        options={{
          title: "Templates",
          tabBarIcon: ({ color, focused, size }) => (
            <CustomTabBarIcon
              focused={focused}
              color={color}
              size={size}
              iconName={focused ? "albums" : "albums-outline"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, focused, size }) => (
            <CustomTabBarIcon
              focused={focused}
              color={color}
              size={size}
              iconName={focused ? "map" : "map-outline"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="accommodations"
        options={{
          title: "Accommodations",
          tabBarIcon: ({ color, focused, size }) => (
            <CustomTabBarIcon
              focused={focused}
              color={color}
              size={size}
              iconName={focused ? "business" : "business-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

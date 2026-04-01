import { I18nProvider } from "@/contexts/I18nContext";
import { AlertProvider } from "@/hooks/useAlert";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryProvider } from "@/providers/QueryProvider";
import { useAuthStore } from "@/stores/authStore";
import { initI18n } from "@/utils/i18n";
import FontLoader from "@/components/FontLoader";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

// Hide all LogBox warnings and errors
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const { loadStoredAuth } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => {
      setI18nInitialized(true);
    });
  }, []);

  useEffect(() => {
    console.log("Root layout loading stored auth...");
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (!i18nInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#DDE6F2",
        }}
      >
        <ActivityIndicator size="large" color="#2865D1" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#001533" }}></Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontLoader>
        <QueryProvider>
          <I18nProvider>
            <AlertProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </AlertProvider>
          </I18nProvider>
        </QueryProvider>
      </FontLoader>
    </GestureHandlerRootView>
  );
}

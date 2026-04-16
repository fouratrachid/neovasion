import { I18nProvider } from "@/contexts/I18nContext";
import { AlertProvider } from "@/hooks/useAlert";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryProvider } from "@/providers/QueryProvider";
import { initI18n } from "@/utils/i18n";
import FontLoader from "@/components/FontLoader";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";
import { useAuthStore } from "@/store/authStore";

// Hide all LogBox warnings and errors
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [i18nInitialized, setI18nInitialized] = useState(false);

  // Connect Zustand Bootstrapping Engine
  const { hydrate, isHydrating, isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Starts the session token validation locally
    hydrate();

    // Intiialize Localizations Globally
    initI18n().then(() => {
      setI18nInitialized(true);
    });
  }, []);

  // Protected Route Logic handled reliably outside of App rendering
  // It listens seamlessly anytime authentication state shifts internally
  useEffect(() => {
    // Only execute navigation rules once Hydration finishes ensuring no flickers
    if (isHydrating || !i18nInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    // We no longer force unauthenticated users to sign-in immediately.
    // They can browse the app and will be prompted to sign in when interacting.
    if (isAuthenticated && inAuthGroup) {
      // Avoid already logged-in users landing inside signin unexpectedly.
      router.replace("/(tabs)/home");
    }
  }, [isHydrating, isAuthenticated, i18nInitialized, segments]);

  if (!i18nInitialized || isHydrating) {
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
        <Text style={{ marginTop: 16, fontSize: 16, color: "#001533" }}>
          Verifying Secure Session...
        </Text>
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

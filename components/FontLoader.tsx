import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { useEffect, useState } from "react";

import { Text, TextInput, View, ActivityIndicator } from "react-native";

export default function FontLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("user_language");
        if (savedLanguage) {
          setLanguage(savedLanguage);
        } else {
          const deviceLocale =
            Localization.getLocales()[0]?.languageCode ?? "fr";
          setLanguage(deviceLocale);
        }
      } catch (e) {
        console.log("Error loading language, defaulting to French:", e);
        setLanguage("fr");
      }
    };
    loadLanguage();
  }, []);

  if (!language) {
    return null;
  }

  return <FontLoaderInner language={language}>{children}</FontLoaderInner>;
}

function FontLoaderInner({
  language,
  children,
}: {
  language: string;
  children: React.ReactNode;
}) {
  const [loaded] = useFonts({
    // Global app font family: Poppins
    AppRegular: Poppins_400Regular,
    AppMedium: Poppins_500Medium,
    AppSemiBold: Poppins_600SemiBold,
    AppBold: Poppins_700Bold,

    // Keep explicit families accessible when needed
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      // @ts-ignore
      if (Text.defaultProps == null) Text.defaultProps = {};
      // @ts-ignore
      Text.defaultProps.style = { fontFamily: "AppRegular" };
      // @ts-ignore
      if (TextInput.defaultProps == null) TextInput.defaultProps = {};
      // @ts-ignore
      TextInput.defaultProps.style = { fontFamily: "AppRegular" };

      setReady(true);
    }
  }, [loaded]);

  if (!loaded || !ready) {
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
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: "#001533",
            fontFamily: "AppRegular",
          }}
        ></Text>
      </View>
    );
  }

  return <>{children}</>;
}

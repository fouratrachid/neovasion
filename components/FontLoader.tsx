import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import {
  TitilliumWeb_400Regular,
  TitilliumWeb_600SemiBold,
  TitilliumWeb_700Bold,
  useFonts,
} from "@expo-google-fonts/titillium-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { useEffect, useState } from "react";

import {
  AppRegistry,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

export default function FontLoader({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("user_language");
        if (savedLanguage) {
          setLanguage(savedLanguage);
        } else {
          const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "fr";
          setLanguage(deviceLocale);
        }
      } catch (e) {
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
  const isArabic = language === "ar";

  const [loaded] = useFonts({
    // Map generic names to specific fonts based on language
    AppRegular: isArabic ? Cairo_400Regular : TitilliumWeb_400Regular,
    AppMedium: isArabic ? Cairo_500Medium : TitilliumWeb_600SemiBold,
    AppSemiBold: isArabic ? Cairo_600SemiBold : TitilliumWeb_600SemiBold,
    AppBold: isArabic ? Cairo_700Bold : TitilliumWeb_700Bold,

    // Keep originals accessible
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
    TitilliumWeb_700Bold,
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
        <Text style={{ marginTop: 16, fontSize: 16, color: "#001533", fontFamily: "AppRegular" }}>
          Initializing...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

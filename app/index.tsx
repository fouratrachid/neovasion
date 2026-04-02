import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function MainApp() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-50">
        <ActivityIndicator size="large" color="#2865D1" />
      </View>
    );
  }

  return <Redirect href="/(tabs)/home" />;
}

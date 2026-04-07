import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 items-center justify-center px-6">
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color="#DC2626"
        />
        <Text className="mt-4 text-[24px] font-poppins-bold text-slate-900 text-center">
          Page Not Found
        </Text>
        <Text className="mt-2 text-[14px] font-poppins-medium text-slate-600 text-center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Pressable
          onPress={() => router.push("/(tabs)/home")}
          className="mt-6 bg-blue-600 px-8 py-3 rounded-lg active:bg-blue-700"
        >
          <Text className="text-white font-poppins-bold text-[16px]">
            Go to Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

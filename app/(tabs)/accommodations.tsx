import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function AccommodationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-extrabold text-slate-900">
          Accommodations
        </Text>
      </View>
    </SafeAreaView>
  );
}

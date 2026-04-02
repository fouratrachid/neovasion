import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SectionHeaderProps = {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

export default function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <View className="mb-3 mt-7 flex-row items-center justify-between px-4">
      <Text className="text-slate-900 text-[22px] font-poppins-bold tracking-tight">
        {title}
      </Text>
      <View className="h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
        <MaterialCommunityIcons name={icon} size={18} color="#2563EB" />
      </View>
    </View>
  );
}

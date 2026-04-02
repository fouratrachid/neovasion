import React from "react";
import { Image, Text, View } from "react-native";

import { CountryNearby } from "./types";

type CountryCardProps = {
  item: CountryNearby;
};

export default function CountryCard({ item }: CountryCardProps) {
  const media = item.files?.[0];

  return (
    <View className="mr-3 pb-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {!!media?.urlfile && (
        <Image
          source={{ uri: media.urlfile }}
          className="h-32 w-full"
          resizeMode="cover"
        />
      )}
      <View className="p-3">
        <Text className="text-slate-900 text-[17px] font-poppins-bold">
          {item.nom}
        </Text>
        {/* <Text className="mt-1 text-teal-700 text-[12px] font-poppins-bold uppercase">
          {item.code}
        </Text> */}
        {!!media?.name && (
          <Text className="mt-2 text-slate-500 text-[12px]" numberOfLines={1}>
            {media.name}
          </Text>
        )}
      </View>
    </View>
  );
}

import React from "react";
import { Image, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { Accommodation } from "./types";

type AccommodationCardProps = {
  item: Accommodation;
};

export default function AccommodationCard({ item }: AccommodationCardProps) {
  const router = useRouter();
  const media = item.files?.[0]?.link;
  const availableServices = (item.services ?? []).filter(
    (entry) => entry.status,
  );
  const availableOptions = (item.options ?? []).filter((entry) => entry.status);

  return (
    <Pressable onPress={() => router.push(`/accommodation/${item._id}`)}>
      <View className="mr-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {!!media && (
          <Image
            source={{ uri: media }}
            className="h-36 w-full"
            resizeMode="cover"
          />
        )}
        <View className="p-4">
          <Text className="text-blue-700 text-[11px] font-poppins-bold uppercase tracking-[1px]">
            {item.type}
          </Text>
          <Text
            className="mt-1 text-slate-900 text-[18px] font-poppins-bold"
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text className="mt-3 text-slate-900 text-[13px] font-poppins-bold">
            Services
          </Text>
          {(availableServices.length > 0
            ? availableServices
            : (item.services ?? [])
          )
            .slice(0, 2)
            .map((service) => (
              <Text
                key={service.name}
                className="mt-1 text-slate-500 text-[12px]"
                numberOfLines={1}
              >
                - {service.name}
              </Text>
            ))}

          <Text className="mt-3 text-slate-900 text-[13px] font-poppins-bold">
            Options
          </Text>
          {(availableOptions.length > 0
            ? availableOptions
            : (item.options ?? [])
          )
            .slice(0, 2)
            .map((option) => (
              <Text
                key={option.name}
                className="mt-1 text-slate-500 text-[12px]"
                numberOfLines={1}
              >
                - {option.name}
              </Text>
            ))}
        </View>
      </View>
    </Pressable>
  );
}

import React from "react";
import { Image, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { formatDate, getInitials } from "./helpers";
import { Trip } from "./types";

type TripCardProps = {
  trip: Trip;
};

export default function TripCard({ trip }: TripCardProps) {
  const router = useRouter();
  const cover = trip.files_trip?.[0]?.link;
  const destination = trip.destination?.[0]?.location;

  return (
    <Pressable onPress={() => router.push(`/trip/${trip._id}`)}>
      <View className="mx-4 mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <View className="relative">
          {!!cover && (
            <Image
              source={{ uri: cover }}
              className="h-48 w-full"
              resizeMode="cover"
            />
          )}
          {trip.price != null && (
            <View className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-md flex-row items-center">
              <Text className="text-slate-900 text-[14px] font-poppins-bold">
                ${trip.price.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        <View className="p-4">
          <Text className="text-blue-700 text-[11px] font-poppins-bold tracking-[1.2px]">
            {(trip.type_trip || "Trip").toUpperCase()}
          </Text>
          <Text className="mt-1 text-slate-900 text-[23px] font-poppins-bold leading-7">
            {trip.title_trip}
          </Text>
          <Text
            className="mt-2 text-slate-600 text-[14px] leading-5"
            numberOfLines={3}
          >
            {trip.desc_trip || "No description available"}
          </Text>

          <View className="mt-3 flex-row items-center">
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={16}
              color="#64748B"
            />
            <Text className="ml-2 text-slate-500 text-[13px]">
              {formatDate(trip.date_depart)}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color="#64748B"
            />
            <Text className="ml-2 text-slate-500 text-[13px]">
              {destination?.ville || "Unknown city"} -{" "}
              {destination?.pays || "Unknown country"}
            </Text>
          </View>

          <View className="mt-3 flex-row flex-wrap gap-2">
            {(trip.categories ?? []).slice(0, 2).map((category) => (
              <View
                key={category}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1"
              >
                <Text className="text-blue-700 text-[11px] font-poppins-bold">
                  {category}
                </Text>
              </View>
            ))}
          </View>

          {!!trip.hoster && (
            <View className="mt-4 flex-row items-center">
              {!!trip.hoster.imageProfile ? (
                <Image
                  source={{ uri: trip.hoster.imageProfile }}
                  className="h-11 w-11 rounded-full"
                />
              ) : (
                <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-700">
                  <Text className="text-white text-[13px] font-poppins-bold">
                    {getInitials(trip.hoster.firstname, trip.hoster.lastname)}
                  </Text>
                </View>
              )}
              <View className="ml-3">
                <Text className="text-slate-900 text-[14px] font-poppins-bold">
                  {trip.hoster.firstname} {trip.hoster.lastname}
                </Text>
                <Text className="mt-0.5 text-slate-500 text-[12px]">
                  Rating: {trip.hoster.avgRating ?? 0}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

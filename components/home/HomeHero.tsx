import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

import { HomeStats } from "./types";

type HomeHeroProps = {
  stats: HomeStats;
};

export default function HomeHero({ stats }: HomeHeroProps) {
  return (
    <View className=" bg-slate-100 px-4 pb-7 pt-4">
      <View className="rounded-3xl border border-[#274A93] bg-[#0A2B72] px-4 py-6">
        <Text className="text-center text-white text-xl font-poppins-bold">
          Discover Your Next Adventure
        </Text>
        {/* <Text className="mt-3 px-3 text-center text-[14px] leading-5 text-blue-100">
          Explore breathtaking destinations, share your travel stories, and
          connect with fellow adventurers around the globe.
        </Text> */}

        <View className="mt-6 rounded-2xl bg-white px-3 py-3">
          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center pr-3">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color="#111827"
              />
              <TextInput
                placeholder="Tunisia"
                placeholderTextColor="#111827"
                className="ml-2 flex-1 py-1 text-[14px] font-poppins-semibold text-slate-900"
              />
            </View>

            <View className="h-7 w-px bg-slate-200" />

            <View className="flex-1 flex-row items-center px-3">
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color="#111827"
              />
              <TextInput
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
                className="ml-2 flex-1 py-1 text-[14px] font-poppins-semibold text-slate-900"
              />
            </View>

            <Pressable className="ml-1 h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white active:opacity-70">
              <MaterialCommunityIcons
                name="magnify"
                size={22}
                color="#111827"
              />
            </Pressable>
          </View>
        </View>
      </View>
      {/*
      <View className="mt-4 flex-row flex-wrap justify-between gap-y-2">
        <View className="w-[49%] rounded-xl border border-blue-300 bg-white/20 px-3 py-2.5">
          <Text className="text-[20px] font-poppins-bold text-white">
            {stats.trips}
          </Text>
          <Text className="mt-1 text-[12px] font-poppins-semibold text-blue-50">
            Trips
          </Text>
        </View>
        <View className="w-[49%] rounded-xl border border-blue-300 bg-white/20 px-3 py-2.5">
          <Text className="text-[20px] font-poppins-bold text-white">
            {stats.stays}
          </Text>
          <Text className="mt-1 text-[12px] font-poppins-semibold text-blue-50">
            Stays
          </Text>
        </View>
        <View className="w-[49%] rounded-xl border border-blue-300 bg-white/20 px-3 py-2.5">
          <Text className="text-[20px] font-poppins-bold text-white">
            {stats.guides}
          </Text>
          <Text className="mt-1 text-[12px] font-poppins-semibold text-blue-50">
            Guides
          </Text>
        </View>
        <View className="w-[49%] rounded-xl border border-blue-300 bg-white/20 px-3 py-2.5">
          <Text className="text-[20px] font-poppins-bold text-white">
            {stats.countries}
          </Text>
          <Text className="mt-1 text-[12px] font-poppins-semibold text-blue-50">
            Countries
          </Text>
        </View>
      
      </View>   */}
    </View>
  );
}

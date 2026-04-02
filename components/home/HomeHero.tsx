import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { HomeStats } from "./types";

type HomeHeroProps = {
  stats: HomeStats;
};

export default function HomeHero({ stats }: HomeHeroProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false); // Close on selection
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View className=" bg-slate-100 px-4 pb-7 pt-4">
      <View className="rounded-3xl border border-[#274A93] bg-[#0A2B72] px-4 py-6">
        <Text className="text-center text-white text-xl font-poppins-bold">
          Discover Your Next Adventure
        </Text>

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

            <Pressable 
              className="flex-1 flex-row items-center px-3"
              onPress={() => setShowPicker(true)}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color="#111827"
              />
              <Text className={`ml-2 flex-1 py-1 text-[14px] font-poppins-semibold ${date ? 'text-slate-900' : 'text-slate-400'}`}>
                {date ? formatDate(date) : "Any dates"}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}

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

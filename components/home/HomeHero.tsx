import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, Text, TextInput, View, Modal, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { HomeStats } from "./types";

type HomeHeroProps = {
  stats: HomeStats;
};

const COUNTRIES = [
  "Tunisia",
  "Morocco",
  "Algeria",
  "France",
  "Spain",
  "Italy",
  "Turkey",
];

export default function HomeHero({ stats }: HomeHeroProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [country, setCountry] = useState<string>("Tunisia");
  const [showCountryModal, setShowCountryModal] = useState(false);

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
            
            <Pressable 
              className="flex-1 flex-row items-center pr-3"
              onPress={() => setShowCountryModal(true)}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color="#111827"
              />
              <Text className="ml-2 flex-1 py-1 text-[14px] font-poppins-semibold text-slate-900" numberOfLines={1}>
                {country}
              </Text>
            </Pressable>

            <View className="h-7 w-px bg-slate-200" />

            <Pressable 
              className="flex-1 flex-row items-center px-3 border-l border-transparent"
              onPress={() => setShowPicker(true)}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color="#111827"
              />
              <Text className={`ml-2 flex-1 py-1 text-[14px] font-poppins-semibold ${date ? 'text-slate-900' : 'text-slate-400'}`} numberOfLines={1}>
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

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowCountryModal(false)}
        >
          <Pressable 
             className="bg-white rounded-t-3xl min-h-[50%] p-6"
             onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-poppins-bold text-slate-900">Where next?</Text>
              <Pressable onPress={() => setShowCountryModal(false)} className="w-8 h-8 items-center justify-center bg-slate-100 rounded-full">
                <MaterialCommunityIcons name="close" size={20} color="#475569" />
              </Pressable>
            </View>
            
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item === country;
                return (
                  <Pressable
                    className={`py-4 border-b border-slate-100 flex-row items-center justify-between ${isSelected ? 'bg-blue-50/50 px-3 -mx-3 rounded-xl border-b-transparent' : ''}`}
                    onPress={() => {
                      setCountry(item);
                      setShowCountryModal(false);
                    }}
                  >
                    <Text className={`text-[15px] ${isSelected ? 'font-poppins-bold text-blue-600' : 'font-poppins-medium text-slate-700'}`}>
                      {item}
                    </Text>
                    {isSelected && <MaterialCommunityIcons name="check-circle" size={20} color="#2563EB" />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
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

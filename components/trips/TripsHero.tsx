import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type TripsHeroProps = {
    country: string;
    tripCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
};

export default function TripsHero({
    country,
    tripCount,
    searchQuery,
    onSearchChange,
}: TripsHeroProps) {
    return (
        <View className="px-4 pb-5 pt-4">
            <LinearGradient
                colors={["#0A2B72", "#1E40AF", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, padding: 20 }}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white/70 text-[13px] font-poppins-semibold tracking-wider uppercase">
                            Explore
                        </Text>
                        <Text className="text-white text-[26px] font-poppins-bold mt-1">
                            Trips
                        </Text>
                    </View>
                    <View className="items-center">
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                            <MaterialCommunityIcons
                                name="airplane"
                                size={24}
                                color="#FFFFFF"
                            />
                        </View>
                    </View>
                </View>

                <View className="mt-3 flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons
                            name="map-marker"
                            size={14}
                            color="#93C5FD"
                        />
                        <Text className="ml-1 text-blue-200 text-[13px] font-poppins-medium">
                            {country}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons
                            name="compass-outline"
                            size={14}
                            color="#93C5FD"
                        />
                        <Text className="ml-1 text-blue-200 text-[13px] font-poppins-medium">
                            {tripCount} {tripCount === 1 ? "trip" : "trips"} available
                        </Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="mt-4 flex-row items-center rounded-2xl bg-white/95 px-3 py-1">
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color="#64748B"
                    />
                    <TextInput
                        className="ml-2 flex-1 py-2.5 text-[14px] font-poppins-medium text-slate-900"
                        placeholder="Search trips, destinations..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={onSearchChange}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <Pressable
                            onPress={() => onSearchChange("")}
                            hitSlop={10}
                        >
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={18}
                                color="#94A3B8"
                            />
                        </Pressable>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
}

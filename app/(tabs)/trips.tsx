import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TripsHero from "@/components/trips/TripsHero";
import TripTypeFilterBar from "@/components/trips/TripTypeFilterBar";
import TripDetailCard from "@/components/trips/TripDetailCard";
import { useTripsActivity } from "@/hooks/useTripsActivity";

export default function TripsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    data,
    filteredTrips,
    isLoading,
    isRefreshing,
    error,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    onRefresh,
    refetch,
  } = useTripsActivity();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <View className="items-center">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-4">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
          <Text className="text-[16px] font-poppins-bold text-slate-800">
            Discovering trips
          </Text>
          <Text className="mt-1 text-[13px] font-poppins-medium text-slate-400">
            Loading amazing destinations for you...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-3">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={32}
            color="#DC2626"
          />
        </View>
        <Text className="mt-2 text-center text-[18px] font-poppins-bold text-slate-800">
          Unable to load trips
        </Text>
        <Text className="mt-2 text-center text-[13px] font-poppins-medium text-slate-500 px-4">
          {error}
        </Text>
        <Pressable
          className="mt-5 flex-row items-center rounded-full bg-blue-600 px-6 py-3 active:opacity-80"
          // style={{
          //     shadowColor: "#2563EB",
          //     shadowOffset: { width: 0, height: 3 },
          //     shadowOpacity: 0.3,
          //     shadowRadius: 6,
          //     elevation: 4,
          // }}
          onPress={() => void refetch()}
        >
          <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFF" />
          <Text className="ml-2 font-poppins-bold text-white">Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top", "bottom"]}>
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TripDetailCard trip={item} />}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <TripsHero
              country={data?.country ?? "Your Area"}
              tripCount={data?.trips?.length ?? 0}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <TripTypeFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <View className="px-4 mt-2 mb-3 flex-row items-center justify-between">
              <Text className="text-slate-800 text-[15px] font-poppins-bold">
                {filteredTrips.length}{" "}
                {filteredTrips.length === 1 ? "trip" : "trips"} found
              </Text>
              {activeFilter !== "all" && (
                <Pressable
                  onPress={() => setActiveFilter("all")}
                  className="flex-row items-center"
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={14}
                    color="#64748B"
                  />
                  <Text className="ml-1 text-slate-500 text-[12px] font-poppins-semibold">
                    Clear filter
                  </Text>
                </Pressable>
              )}
            </View>
          </>
        }
        ListEmptyComponent={
          <View className="mx-4 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mb-3">
              <MaterialCommunityIcons
                name="airplane-off"
                size={28}
                color="#94A3B8"
              />
            </View>
            <Text className="text-center text-[16px] font-poppins-bold text-slate-700">
              No trips found
            </Text>
            <Text className="mt-1 text-center text-[13px] font-poppins-medium text-slate-400">
              {searchQuery
                ? "Try a different search term"
                : "Pull down to refresh or adjust your filters."}
            </Text>
            {(searchQuery || activeFilter !== "all") && (
              <Pressable
                className="mt-4 rounded-full bg-slate-100 px-5 py-2.5 active:opacity-70"
                onPress={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
              >
                <Text className="text-slate-600 text-[13px] font-poppins-bold">
                  Reset all filters
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

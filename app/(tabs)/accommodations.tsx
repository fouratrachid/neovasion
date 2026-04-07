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

import AccommodationsHero from "@/components/accommodations/AccommodationsHero";
import AccommodationFilterBar from "@/components/accommodations/AccommodationFilterBar";
import AccommodationDetailCard from "@/components/accommodations/AccommodationDetailCard";
import { useAccommodations } from "@/hooks/useAccommodations";

export default function AccommodationsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    data,
    filteredAccommodations,
    isLoading,
    isRefreshing,
    error,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    availableTypes,
    onRefresh,
    refetch,
  } = useAccommodations();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <View className="items-center">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 mb-4">
            <ActivityIndicator size="large" color="#059669" />
          </View>
          <Text className="text-[16px] font-poppins-bold text-slate-800">
            Finding perfect stays
          </Text>
          <Text className="mt-1 text-[13px] font-poppins-medium text-slate-400">
            Loading comfortable accommodations...
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
          Unable to load stays
        </Text>
        <Text className="mt-2 text-center text-[13px] font-poppins-medium text-slate-500 px-4">
          {error}
        </Text>
        <Pressable
          className="mt-5 flex-row items-center rounded-full bg-emerald-600 px-6 py-3 active:opacity-80"
          style={{
            shadowColor: "#059669",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
          }}
          onPress={() => refetch()}
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
        data={filteredAccommodations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AccommodationDetailCard item={item} />}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#059669"
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AccommodationsHero
              country={data?.country ?? "Your Area"}
              count={data?.accomodations?.length ?? 0}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <AccommodationFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              availableTypes={availableTypes}
            />
            <View className="px-4 mt-2 mb-3 flex-row items-center justify-between">
              <Text className="text-slate-800 text-[15px] font-poppins-bold">
                {filteredAccommodations.length}{" "}
                {filteredAccommodations.length === 1 ? "stay" : "stays"} found
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
                name="home-search-outline"
                size={28}
                color="#94A3B8"
              />
            </View>
            <Text className="text-center text-[16px] font-poppins-bold text-slate-700">
              No accommodations found
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

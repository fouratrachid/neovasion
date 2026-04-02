import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AccommodationCard from "@/components/home/AccommodationCard";
import CountryCard from "@/components/home/CountryCard";
import GuideCard from "@/components/home/GuideCard";
import HomeHero from "@/components/home/HomeHero";
import SectionHeader from "@/components/home/SectionHeader";
import TripCard from "@/components/home/TripCard";
import { useHomeActivity } from "@/hooks/useHomeActivity";

const HomeScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    data,
    isLoading,
    isRefreshing,
    error,
    fetchHomeActivity,
    onRefresh,
    stats,
  } = useHomeActivity();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-slate-500 text-[15px] font-poppins-medium">
          Loading your travel inspirations...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={42}
          color="#DC2626"
        />
        <Text className="mt-2 text-red-700 text-[20px] font-poppins-bold text-center">
          Unable to load home activity
        </Text>
        <Text className="mt-2 text-red-600 text-center">{error}</Text>
        <Pressable
          className="mt-5 rounded-full bg-red-600 px-5 py-3 active:opacity-80"
          onPress={() => void fetchHomeActivity()}
        >
          <Text className="text-white font-poppins-bold">Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100 " edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <HomeHero stats={stats} />

        <SectionHeader
          title="Nearby Countries"
          icon="map-marker-radius-outline"
        />
        <FlatList
          data={data?.countriesNearby ?? []}
          horizontal
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="pl-4 pr-2"
          removeClippedSubviews
          renderItem={({ item }) => <CountryCard item={item} />}
        />

        <SectionHeader title="Featured Trips" icon="airplane-takeoff" />
        {(data?.trips ?? []).map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}

        <SectionHeader title="Top Accommodations" icon="bed-queen-outline" />
        <FlatList
          data={data?.accomodations ?? []}
          horizontal
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="pl-4 pr-2"
          removeClippedSubviews
          renderItem={({ item }) => <AccommodationCard item={item} />}
        />

        <SectionHeader title="Local Guides" icon="account-group-outline" />
        {(data?.profiles ?? []).map((profile) => (
          <GuideCard key={profile._id} profile={profile} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

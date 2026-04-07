import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AccommodationCard from "@/components/home/AccommodationCard";
import CountryCard from "@/components/home/CountryCard";
import GuideCard from "@/components/home/GuideCard";
import HomeHero from "@/components/home/HomeHero";
import SectionHeader from "@/components/home/SectionHeader";
import TripCard from "@/components/home/TripCard";
import { useHomeActivity } from "@/hooks/useHomeActivity";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { SafeImage } from "@/components/SafeImage";

const HomeTopBar = () => {
  const { data: profileResp, isLoading } = useAuthProfile();
  const router = useRouter();
  const user = profileResp?.data;

  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-2 z-10 bg-slate-100">
      <View className="flex-1 pr-4">
        <Text className="text-[13px] font-poppins-semibold tracking-wide text-slate-500 uppercase">
          Good morning 👋
        </Text>
        {isLoading ? (
          <View className="h-6 w-32 bg-slate-200 rounded mt-1 animate-pulse" />
        ) : (
          <Text
            className="text-[20px] font-poppins-bold text-slate-900 mt-0.5"
            numberOfLines={1}
          >
            {user ? `${user.firstName} ${user.lastName}` : "Guest Traveler"}
          </Text>
        )}
      </View>
      <Pressable
        onPress={() => {
          if (!user) {
            router.push("/(auth)/sign-in");
          } else {
            // Navigate to profile or show settings
            router.push("/profile/edit");
          }
        }}
        className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 items-center justify-center border-2 border-white"
        // style={{
        //   elevation: 2,
        //   shadowColor: "#000",
        //   shadowOpacity: 0.1,
        //   shadowRadius: 3,
        //   shadowOffset: { width: 0, height: 1 },
        // }}
      >
        {user?.imageLink ? (
          <SafeImage
            source={user.imageLink}
            className="w-full h-full"
            fallbackIcon="person"
          />
        ) : (
          <MaterialCommunityIcons
            name={user ? "account" : "login"}
            size={22}
            color="#1E3A8A"
          />
        )}
      </Pressable>
    </View>
  );
};

const HomeScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { data, isLoading, isRefreshing, error, refetch, onRefresh, stats } =
    useHomeActivity();

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
          onPress={() => refetch()}
        >
          <Text className="text-white font-poppins-bold">Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top", "bottom"]}>
      <HomeTopBar />

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

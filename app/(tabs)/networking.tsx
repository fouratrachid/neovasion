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

import NetworkingPostCard from "@/components/networking/NetworkingPostCard";
import { useNetworkingActivity } from "@/hooks/useNetworkingActivity";

export default function NetworkingScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { data, posts, isLoading, isRefreshing, error, onRefresh, refetch } =
    useNetworkingActivity();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-[15px] font-poppins-medium text-slate-500">
          Loading travelers around you...
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
        <Text className="mt-2 text-center text-[20px] font-poppins-bold text-red-700">
          Unable to load networking feed
        </Text>
        <Text className="mt-2 text-center font-poppins-medium text-red-600">
          {error}
        </Text>
        <Pressable
          className="mt-5 rounded-full bg-red-600 px-5 py-3 active:opacity-80"
          onPress={() => void refetch()}
        >
          <Text className="font-poppins-bold text-white">Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top", "bottom"]}>
      <View className="px-4 pb-3 pt-2">
        <Text className="text-[28px] font-poppins-bold text-slate-900">
          Networking
        </Text>
        <Text className="mt-1 text-[14px] font-poppins-medium text-slate-500">
          Public posts in {data?.country ?? "your area"}
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <NetworkingPostCard post={item} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + 24,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10">
            <MaterialCommunityIcons
              name="account-search-outline"
              size={36}
              color="#64748B"
            />
            <Text className="mt-3 text-center text-[17px] font-poppins-bold text-slate-800">
              No posts yet
            </Text>
            <Text className="mt-1 text-center text-[14px] font-poppins-medium text-slate-500">
              Pull down to refresh and discover new travelers.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

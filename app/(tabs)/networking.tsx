import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetworkingPostCard from "@/components/networking/NetworkingPostCard";
import ProfileCard from "@/components/networking/ProfileCard";
import { useNetworkingActivity } from "@/hooks/useNetworkingActivity";
import { useNetworkingProfiles } from "@/hooks/useNetworkingProfiles";

export default function NetworkingScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"feed" | "profiles">("feed");

  const feedQuery = useNetworkingActivity();
  const profilesQuery = useNetworkingProfiles();

  const handlePostPress = (postId: string, post: any) => {
    router.push({
      pathname: "/networking/[id]",
      params: {
        id: postId,
        post: JSON.stringify(post),
      },
    });
  };

  const handleProfilePress = (profileId: string) => {
    // Navigate to a profile details screen when clicked
    router.push({
      pathname: "/networking/profile/[id]" as any,
      params: { id: profileId },
    });
  };

  const handleRefresh = () => {
    if (activeTab === "feed") {
      feedQuery.onRefresh();
    } else {
      profilesQuery.onRefresh();
    }
  };

  const isLoading =
    activeTab === "feed" ? feedQuery.isLoading : profilesQuery.isLoading;
  const isRefreshing =
    activeTab === "feed" ? feedQuery.isRefreshing : profilesQuery.isRefreshing;
  const error = activeTab === "feed" ? feedQuery.error : profilesQuery.error;
  const currentDataInfo =
    activeTab === "feed" ? feedQuery.data : profilesQuery.data;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-3 text-[15px] font-poppins-medium text-slate-500">
            {activeTab === "feed" ? "Loading posts..." : "Loading profiles..."}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center pt-20 px-6">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={42}
            color="#DC2626"
          />
          <Text className="mt-2 text-center text-[20px] font-poppins-bold text-red-700">
            {activeTab === "feed"
              ? "Unable to load networking feed"
              : "Unable to load profiles"}
          </Text>
          <Text className="mt-2 text-center font-poppins-medium text-red-600">
            {error}
          </Text>
          <Pressable
            className="mt-5 rounded-full bg-red-600 px-5 py-3 active:opacity-80"
            onPress={() =>
              activeTab === "feed"
                ? feedQuery.refetch()
                : profilesQuery.refetch()
            }
          >
            <Text className="font-poppins-bold text-white">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    if (activeTab === "feed") {
      return (
        <FlatList
          data={feedQuery.posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePostPress(item._id, item)}>
              <NetworkingPostCard post={item} />
            </Pressable>
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: tabBarHeight + 24,
            paddingTop: 10,
          }}
          refreshControl={
            <RefreshControl
              refreshing={feedQuery.isRefreshing}
              onRefresh={feedQuery.onRefresh}
            />
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
      );
    }

    return (
      <FlatList
        data={profilesQuery.profiles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onPress={() => handleProfilePress(item.uniqueName || item._id)}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + 24,
          paddingTop: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={profilesQuery.isRefreshing}
            onRefresh={profilesQuery.onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 mt-6">
            <MaterialCommunityIcons
              name="account-search-outline"
              size={36}
              color="#64748B"
            />
            <Text className="mt-3 text-center text-[17px] font-poppins-bold text-slate-800">
              No profiles found
            </Text>
            <Text className="mt-1 text-center text-[14px] font-poppins-medium text-slate-500">
              Pull down to refresh and discover new traveler profiles.
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top", "bottom"]}>
      <View className="px-4 pt-2">
        <Text className="text-[28px] font-poppins-bold text-slate-900">
          Networking
        </Text>
        <Text className="mt-1 text-[14px] font-poppins-medium text-slate-500">
          Discover {activeTab === "feed" ? "posts" : "profiles"} in{" "}
          {currentDataInfo?.country ?? "your area"}
        </Text>
      </View>

      <View className="px-4 py-3 flex-row gap-4 mt-2">
        <Pressable
          onPress={() => setActiveTab("feed")}
          className={`flex-1 rounded-2xl py-3 items-center ${activeTab === "feed" ? "bg-blue-600 shadow-md shadow-blue-600/30" : "bg-white shadow-sm border border-slate-200"}`}
        >
          <Text
            className={`font-poppins-semi-bold ${activeTab === "feed" ? "text-white" : "text-slate-600"}`}
          >
            Feed
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("profiles")}
          className={`flex-1 rounded-2xl py-3 items-center ${activeTab === "profiles" ? "bg-blue-600 shadow-md shadow-blue-600/30" : "bg-white shadow-sm border border-slate-200"}`}
        >
          <Text
            className={`font-poppins-semi-bold ${activeTab === "profiles" ? "text-white" : "text-slate-600"}`}
          >
            Profiles
          </Text>
        </Pressable>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

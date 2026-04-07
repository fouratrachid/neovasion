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

import TripDetailCard from "@/components/trips/TripDetailCard";
import { useTemplates } from "@/hooks/useTemplates";

export default function TemplatesScreen() {
    const tabBarHeight = useBottomTabBarHeight();
    const {
        trips,
        isLoading,
        isRefreshing,
        error,
        onRefresh,
        refetch,
    } = useTemplates();

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
                <View className="items-center">
                    <View className="h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 mb-4">
                        <ActivityIndicator size="large" color="#4F46E5" />
                    </View>
                    <Text className="text-[16px] font-poppins-bold text-slate-800">
                        Loading Templates
                    </Text>
                    <Text className="mt-1 text-[13px] font-poppins-medium text-slate-400">
                        Gathering the best pre-made trip packages...
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
                    Failed to Load
                </Text>
                <Text className="mt-2 text-center text-[13px] font-poppins-medium text-slate-500 px-4">
                    {error}
                </Text>
                <Pressable
                    className="mt-5 flex-row items-center rounded-full bg-indigo-600 px-6 py-3 active:opacity-80"
                    style={{ shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }}
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
            {/* Simple Top Header */}
            <View className="px-5 pt-4 pb-2 z-10 bg-slate-100 border-b border-slate-200">
                <Text className="text-[22px] font-poppins-bold text-slate-900">Trip Templates</Text>
                <Text className="text-[13px] font-poppins-medium text-slate-500 mt-1">
                    Ready-made packages crafted perfectly for you.
                </Text>
            </View>

            <FlatList
                data={trips}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <TripDetailCard trip={item} routePrefix="/template" />}
                contentContainerStyle={{
                    paddingTop: 16,
                    paddingBottom: tabBarHeight + 24,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#4F46E5"
                    />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="mx-4 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12">
                        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mb-3">
                            <MaterialCommunityIcons name="folder-open-outline" size={28} color="#94A3B8" />
                        </View>
                        <Text className="text-center text-[16px] font-poppins-bold text-slate-700">
                            No templates found
                        </Text>
                        <Text className="mt-1 text-center text-[13px] font-poppins-medium text-slate-400">
                            Pull down to check for new packages.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

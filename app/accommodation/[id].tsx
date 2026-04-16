import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAccommodationDetails } from "@/hooks/useAccommodationDetails";
import { useLocationName } from "@/hooks/useLocationName";
import { AccommodationFile } from "@/components/accommodations/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AccommodationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { accommodation, isLoading, error } = useAccommodationDetails(
    id as string,
  );
  const { locationName } = useLocationName(accommodation?.position);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 mb-4">
          <ActivityIndicator size="large" color="#059669" />
        </View>
        <Text className="text-[16px] font-poppins-bold text-slate-800">
          Fetching Details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !accommodation) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center px-6">
        <MaterialCommunityIcons name="home-off" size={48} color="#94A3B8" />
        <Text className="mt-4 text-[18px] font-poppins-bold text-slate-800">
          Accommodation not found
        </Text>
        <Text className="text-[14px] text-slate-500 mt-2 text-center">
          {error}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-slate-200 px-6 py-3 rounded-full"
        >
          <Text className="font-poppins-bold text-slate-700">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const availableServices = (accommodation.services || []).filter(
    (s) => s.status,
  );
  const availableOptions = (accommodation.options || []).filter(
    (o) => o.status,
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Nav Header Floating */}
      <View className="absolute top-12 left-4 z-10 flex-row justify-between w-full pr-8">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full items-center justify-center border border-white/40"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </Pressable>

        <Pressable
          className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full items-center justify-center border border-white/40"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <MaterialCommunityIcons name="heart-outline" size={22} color="#FFF" />
        </Pressable>
      </View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Carousel */}
        <HeroCarousel files={accommodation.files ?? []} />

        {/* Main Content Card */}
        <View className="px-5 pt-6 pb-6 bg-white rounded-t-3xl -mt-6">
          {/* Top Row - Badges */}
          <View className="flex-row items-center gap-2 mb-3">
            <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <Text className="text-emerald-700 font-poppins-bold text-[11px] uppercase tracking-wider">
                {accommodation.type}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${accommodation.is_active ? "bg-green-100" : "bg-red-100"}`}
            >
              <Text
                className={`font-poppins-bold text-[11px] ${accommodation.is_active ? "text-green-700" : "text-red-700"}`}
              >
                {accommodation.is_active ? "AVAILABLE" : "UNAVAILABLE"}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-[26px] font-poppins-bold text-slate-900 leading-8">
            {accommodation.name}
          </Text>

          {/* Location */}
          <View className="flex-row items-center mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={16}
                color="#2563EB"
              />
            </View>
            <Text className="ml-3 flex-1 text-slate-600 text-[13px] font-poppins-medium leading-5">
              {locationName || accommodation.position}
            </Text>
            <Pressable className="ml-2 bg-blue-600 px-3 py-1.5 rounded-lg active:opacity-80">
              <Text className="text-white text-[11px] font-poppins-bold">
                Map
              </Text>
            </Pressable>
          </View>

          <View className="h-px bg-slate-100 my-6" />

          {/* HTML Description */}
          {accommodation.description && (
            <View className="mb-6">
              <Text className="text-[18px] font-poppins-bold text-slate-900 mb-2">
                About this place
              </Text>
              <RenderHtml
                contentWidth={SCREEN_WIDTH - 40}
                source={{ html: accommodation.description }}
                tagsStyles={{
                  p: {
                    color: "#475569",
                    fontSize: 13,
                    lineHeight: 22,
                    fontFamily: "AppRegular",
                    marginBottom: 10,
                  },
                  h1: {
                    color: "#0F172A",
                    fontSize: 20,
                    fontFamily: "AppBold",
                    marginBottom: 8,
                    marginTop: 12,
                  },
                  h2: {
                    color: "#0F172A",
                    fontSize: 18,
                    fontFamily: "AppBold",
                    marginBottom: 8,
                    marginTop: 12,
                  },
                  h3: {
                    color: "#0F172A",
                    fontSize: 16,
                    fontFamily: "AppBold",
                    marginBottom: 8,
                    marginTop: 12,
                  },
                  ul: {
                    color: "#475569",
                    fontSize: 13,
                    fontFamily: "AppRegular",
                    paddingLeft: 10,
                    marginTop: 4,
                  },
                  li: {
                    color: "#475569",
                    fontSize: 13,
                    fontFamily: "AppRegular",
                    marginBottom: 4,
                    lineHeight: 20,
                  },
                  strong: { fontFamily: "AppBold", color: "#1E293B" },
                  u: { textDecorationLine: "underline" },
                  s: { textDecorationLine: "line-through" },
                  em: { fontStyle: "italic", fontFamily: "AppMedium" },
                }}
              />
            </View>
          )}

          {/* Services Overview */}
          {availableServices.length > 0 && (
            <View className="mb-6">
              <Text className="text-[18px] font-poppins-bold text-slate-900 mb-4">
                Amenities
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {availableServices.map((service, idx) => {
                  const isWifi = service.name.toLowerCase().includes("wifi");
                  const isFood =
                    service.name.toLowerCase().includes("déjeuner") ||
                    service.name.toLowerCase().includes("dîner");
                  const isNavette = service.name
                    .toLowerCase()
                    .includes("navette");
                  const isPark = service.name.toLowerCase().includes("parking");
                  const isLaundry = service.name
                    .toLowerCase()
                    .includes("blanchisserie");

                  let iconName = "check-circle-outline";
                  if (isWifi) iconName = "wifi";
                  else if (isFood) iconName = "silverware-fork-knife";
                  else if (isNavette) iconName = "bus";
                  else if (isPark) iconName = "parking";
                  else if (isLaundry) iconName = "washing-machine";

                  return (
                    <View
                      key={idx}
                      className="w-[47%] bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-row items-start"
                    >
                      <MaterialCommunityIcons
                        name={iconName as any}
                        size={20}
                        color="#059669"
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-slate-800 text-[12px] font-poppins-bold mb-0.5">
                          {service.name}
                        </Text>
                        <Text className="text-slate-500 text-[11px] font-poppins-regular leading-4">
                          {service.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Extra Options */}
          {availableOptions.length > 0 && (
            <View className="mb-6">
              <Text className="text-[18px] font-poppins-bold text-slate-900 mb-4">
                Included Options
              </Text>
              <View className="gap-y-3 px-1">
                {availableOptions.map((opt, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                  >
                    <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center">
                      <MaterialCommunityIcons
                        name="star-four-points-outline"
                        size={20}
                        color="#D97706"
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-slate-800 text-[14px] font-poppins-bold">
                        {opt.name}
                      </Text>
                      <Text className="text-slate-500 text-[12px] font-poppins-medium mt-0.5">
                        {opt.description}
                      </Text>
                    </View>
                    {opt.type && (
                      <View className="bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Text className="text-slate-600 text-[10px] font-poppins-bold uppercase">
                          {opt.type}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-5 pt-3 pb-8 flex-row items-center justify-between shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
        <View>
          <Text className="text-[11px] font-poppins-semibold text-slate-500 uppercase">
            Availability
          </Text>
          <Text className="text-[18px] font-poppins-bold text-emerald-600 mt-0.5">
            Open to book
          </Text>
        </View>
        <Pressable className="bg-emerald-600 px-8 py-3.5 rounded-full items-center justify-center flex-row shadow-sm">
          <Text className="text-white font-poppins-bold text-[15px]">
            Check Dates
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={18}
            color="white"
            className="ml-2"
          />
        </Pressable>
      </View>
    </View>
  );
}

// Extracted Carousel
function HeroCarousel({ files }: { files: AccommodationFile[] }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null)
        setActiveIndex(viewableItems[0].index);
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View className="h-96 w-full relative bg-slate-200">
      {files.length > 0 ? (
        <>
          <FlatList
            data={files}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.name ?? index.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.link }}
                style={{ width: SCREEN_WIDTH, height: 384 }}
                resizeMode="cover"
              />
            )}
          />
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.5)",
              "transparent",
              "transparent",
              "rgba(0,0,0,0.3)",
            ]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            pointerEvents="none"
          />
          {files.length > 1 && (
            <View className="absolute bottom-10 left-0 right-0 flex-row justify-center space-x-1.5">
              {files.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${activeIndex === i ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <View className="flex-1 items-center justify-center bg-slate-200">
          <MaterialCommunityIcons
            name="home-city-outline"
            size={48}
            color="#94A3B8"
          />
        </View>
      )}
    </View>
  );
}

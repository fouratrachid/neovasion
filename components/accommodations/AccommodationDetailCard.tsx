import React, { useState, useRef, useCallback } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
  ViewToken,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Accommodation } from "./types";

type AccommodationDetailCardProps = {
  item: Accommodation;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH - 32;
const IMAGE_HEIGHT = 220;

import { router } from "expo-router";

export default function AccommodationDetailCard({
  item,
}: AccommodationDetailCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const files = item.files ?? [];
  const activeServices = (item.services ?? []).filter((s) => s.status);
  const activeOptions = (item.options ?? []).filter((o) => o.status);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveImageIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <Pressable
      className="mx-4 mb-5 overflow-hidden rounded-3xl bg-white"
      // style={{
      //     shadowColor: "#064E3B",
      //     shadowOffset: { width: 0, height: 4 },
      //     shadowOpacity: 0.08,
      //     shadowRadius: 16,
      //     elevation: 5,
      // }}
      onPress={() => router.push(`/accommodation/${item._id}` as any)}
    >
      {/* Carousel */}
      {files.length > 0 && (
        <View>
          <FlatList
            data={files}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(f, index) => f.name + index}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item: f }) => (
              <Image
                source={{ uri: f.link }}
                style={{
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                }}
                resizeMode="cover"
              />
            )}
          />

          {/* Image overlay gradient */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
            }}
          />

          {/* Type badge */}
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 50,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "AppBold",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {item.type}
            </Text>
          </View>

          {/* Status badge */}
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 50,
              backgroundColor: item.is_active ? "#10B981" : "#EF4444",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "AppBold",
                color: "#FFFFFF",
              }}
            >
              {item.is_active ? "AVAILABLE" : "UNAVAILABLE"}
            </Text>
          </View>

          {/* Dot indicators */}
          {files.length > 1 && (
            <View
              style={{
                position: "absolute",
                bottom: 10,
                alignSelf: "center",
                flexDirection: "row",
                gap: 5,
              }}
            >
              {files.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: activeImageIndex === index ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      activeImageIndex === index
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Details */}
      <View className="p-4">
        <Text className="text-slate-900 text-[20px] font-poppins-bold leading-6">
          {item.name}
        </Text>

        <View className="mt-2.5 flex-row items-center border border-slate-100 bg-slate-50 p-2 rounded-xl">
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={16}
            color="#059669"
          />
          <Text className="ml-2 flex-1 text-slate-600 text-[12px] font-poppins-medium">
            {item.position.trim()}
          </Text>
        </View>

        {/* Services */}
        {activeServices.length > 0 && (
          <View className="mt-4">
            <Text className="text-[13px] font-poppins-bold text-slate-800 mb-2">
              Top Services
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {activeServices.map((srv, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100"
                >
                  <MaterialCommunityIcons
                    name={
                      srv.name.toLowerCase().includes("wifi")
                        ? "wifi"
                        : srv.name.toLowerCase().includes("navette")
                          ? "bus"
                          : "check"
                    }
                    size={14}
                    color="#059669"
                  />
                  <Text className="ml-1.5 text-emerald-800 text-[11px] font-poppins-semibold">
                    {srv.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Options */}
        {activeOptions.length > 0 && (
          <View className="mt-4">
            <Text className="text-[13px] font-poppins-bold text-slate-800 mb-2">
              Included Options
            </Text>
            <View className="gap-y-2">
              {activeOptions.map((opt, idx) => (
                <View key={idx} className="flex-row items-start">
                  <MaterialCommunityIcons
                    name="star-four-points-outline"
                    size={14}
                    color="#D97706"
                    style={{ marginTop: 2 }}
                  />
                  <View className="ml-2 flex-1">
                    <Text className="text-slate-700 text-[12px] font-poppins-semibold">
                      {opt.name}
                    </Text>
                    <Text className="text-slate-500 text-[11px] font-poppins-medium">
                      {opt.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer Action */}
        <View className="mt-5 border-t border-slate-100 pt-4 flex-row justify-between items-center">
          <Text className="text-emerald-600 font-poppins-semibold text-[13px]">
            {activeServices.length + activeOptions.length} Amenities
          </Text>
          <Pressable
            className="bg-emerald-600 px-5 py-2.5 rounded-xl active:opacity-80 flex-row items-center"
            // style={{
            //   shadowColor: "#059669",
            //   shadowOffset: { width: 0, height: 2 },
            //   shadowOpacity: 0.2,
            //   shadowRadius: 4,
            //   elevation: 3,
            // }}
            onPress={() => router.push(`/accommodation/${item._id}` as any)}
          >
            <Text className="text-white font-poppins-bold text-[12px]">
              View Details
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={14}
              color="white"
              className="ml-1"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

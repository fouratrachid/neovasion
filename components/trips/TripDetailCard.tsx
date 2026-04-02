import React, { useState, useRef, useCallback } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    Text,
    View,
    ViewToken,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Trip } from "./types";
import {
    formatTripDate,
    formatShortDate,
    getDurationDays,
    getInitials,
    getTripTypeConfig,
    renderStars,
} from "./helpers";

type TripDetailCardProps = {
    trip: Trip;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH - 32;
const IMAGE_HEIGHT = 220;

export default function TripDetailCard({ trip }: TripDetailCardProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const typeConfig = getTripTypeConfig(trip.type_trip);
    const destination = trip.destination?.[0];
    const duration = getDurationDays(destination?.date_start, destination?.date_end);
    const accommodation = trip.hebergements?.[0];
    const images = trip.files_trip ?? [];

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index != null) {
                setActiveImageIndex(viewableItems[0].index);
            }
        },
        [],
    );

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <View
            className="mx-4 mb-5 overflow-hidden rounded-3xl bg-white"
            style={{
                shadowColor: "#1E3A5F",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 5,
            }}
        >
            {/* Image Carousel */}
            {images.length > 0 && (
                <View>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item.id ?? `img-${index}`}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false },
                        )}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.link }}
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
                        colors={["transparent", "rgba(0,0,0,0.4)"]}
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
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 50,
                            backgroundColor: typeConfig.bgColor,
                        }}
                    >
                        <MaterialCommunityIcons
                            name={typeConfig.icon}
                            size={14}
                            color={typeConfig.color}
                        />
                        <Text
                            style={{
                                marginLeft: 5,
                                fontSize: 11,
                                fontFamily: "AppBold",
                                color: typeConfig.color,
                                textTransform: "uppercase",
                                letterSpacing: 0.8,
                            }}
                        >
                            {typeConfig.label}
                        </Text>
                    </View>

                    {/* Duration badge */}
                    {duration != null && (
                        <View
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 50,
                                backgroundColor: "rgba(0,0,0,0.55)",
                            }}
                        >
                            <MaterialCommunityIcons
                                name="clock-outline"
                                size={13}
                                color="#FFFFFF"
                            />
                            <Text
                                style={{
                                    marginLeft: 4,
                                    fontSize: 11,
                                    fontFamily: "AppBold",
                                    color: "#FFFFFF",
                                }}
                            >
                                {duration} days
                            </Text>
                        </View>
                    )}

                    {/* Dot indicators */}
                    {images.length > 1 && (
                        <View
                            style={{
                                position: "absolute",
                                bottom: 10,
                                alignSelf: "center",
                                flexDirection: "row",
                                gap: 5,
                            }}
                        >
                            {images.map((_, index) => (
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

            {/* Card Content */}
            <View className="p-4">
                {/* Title & Description */}
                <Text
                    className="text-slate-900 text-[20px] font-poppins-bold leading-6"
                    numberOfLines={2}
                >
                    {trip.title_trip}
                </Text>
                <Text
                    className="mt-2 text-slate-500 text-[13px] font-poppins-medium leading-5"
                    numberOfLines={2}
                >
                    {trip.desc_trip ?? "No description available."}
                </Text>

                {/* Info Row */}
                <View className="mt-3 flex-row flex-wrap gap-y-2">
                    {/* Destination */}
                    {destination?.location && (
                        <View className="mr-4 flex-row items-center">
                            <View className="h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                                <MaterialCommunityIcons
                                    name="map-marker"
                                    size={14}
                                    color="#2563EB"
                                />
                            </View>
                            <Text className="ml-2 text-slate-700 text-[12px] font-poppins-semibold">
                                {destination.location.ville},{" "}
                                {destination.location.pays}
                            </Text>
                        </View>
                    )}

                    {/* Date */}
                    <View className="flex-row items-center">
                        <View className="h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={14}
                                color="#D97706"
                            />
                        </View>
                        <Text className="ml-2 text-slate-700 text-[12px] font-poppins-semibold">
                            {formatTripDate(trip.date_depart)}
                        </Text>
                    </View>
                </View>

                {/* Keywords / Tags */}
                {(trip.mot_cle ?? []).length > 0 && (
                    <View className="mt-3 flex-row flex-wrap gap-1.5">
                        {trip.mot_cle!.slice(0, 4).map((keyword) => (
                            <View
                                key={keyword}
                                className="rounded-full bg-slate-100 px-2.5 py-1"
                            >
                                <Text className="text-slate-600 text-[10px] font-poppins-semibold">
                                    #{keyword}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Includes */}
                {(trip.includes ?? []).length > 0 && (
                    <View className="mt-3 flex-row flex-wrap gap-2">
                        {trip.includes!.slice(0, 2).map((inc, idx) => (
                            <View
                                key={idx}
                                className="flex-row items-center rounded-xl bg-emerald-50 px-3 py-1.5"
                            >
                                <MaterialCommunityIcons
                                    name={
                                        inc.type === "transport"
                                            ? "bus"
                                            : inc.type === "meal"
                                              ? "silverware-fork-knife"
                                              : "check-circle-outline"
                                    }
                                    size={13}
                                    color="#059669"
                                />
                                <Text
                                    className="ml-1.5 text-emerald-800 text-[11px] font-poppins-semibold"
                                    numberOfLines={1}
                                    style={{ maxWidth: 140 }}
                                >
                                    {inc.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Categories */}
                {(trip.categories ?? []).length > 0 && (
                    <View className="mt-3 flex-row flex-wrap gap-2">
                        {trip.categories!.map((cat) => (
                            <View
                                key={cat}
                                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1"
                            >
                                <Text className="text-blue-700 text-[11px] font-poppins-bold">
                                    {cat}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Divider */}
                <View className="mt-4 mb-3 h-px bg-slate-100" />

                {/* Accommodation Preview */}
                {accommodation && (
                    <View className="mb-3">
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons
                                name="bed-outline"
                                size={15}
                                color="#64748B"
                            />
                            <Text className="ml-1.5 text-slate-500 text-[11px] font-poppins-bold uppercase tracking-wider">
                                Stay
                            </Text>
                        </View>
                        <View className="mt-2 flex-row items-center rounded-2xl bg-slate-50 p-3">
                            {accommodation.files?.[0]?.link ? (
                                <Image
                                    source={{ uri: accommodation.files[0].link }}
                                    className="h-12 w-12 rounded-xl"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="h-12 w-12 items-center justify-center rounded-xl bg-slate-200">
                                    <MaterialCommunityIcons
                                        name="office-building"
                                        size={20}
                                        color="#94A3B8"
                                    />
                                </View>
                            )}
                            <View className="ml-3 flex-1">
                                <Text
                                    className="text-slate-800 text-[13px] font-poppins-bold"
                                    numberOfLines={1}
                                >
                                    {accommodation.name}
                                </Text>
                                <Text className="text-slate-500 text-[11px] font-poppins-medium mt-0.5">
                                    {accommodation.type}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                {(accommodation.services ?? [])
                                    .filter((s) => s.status)
                                    .slice(0, 2)
                                    .map((s, i) => (
                                        <View
                                            key={i}
                                            className="h-6 w-6 items-center justify-center rounded-md bg-blue-50"
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    s.name?.toLowerCase().includes("wifi")
                                                        ? "wifi"
                                                        : s.name
                                                                ?.toLowerCase()
                                                                .includes("navette")
                                                          ? "bus"
                                                          : "check"
                                                }
                                                size={12}
                                                color="#2563EB"
                                            />
                                        </View>
                                    ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Hoster */}
                {trip.hoster && (
                    <View className="flex-row items-center">
                        {trip.hoster.imageProfile ? (
                            <Image
                                source={{ uri: trip.hoster.imageProfile }}
                                className="h-10 w-10 rounded-full"
                            />
                        ) : (
                            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-700">
                                <Text className="text-white text-[12px] font-poppins-bold">
                                    {getInitials(
                                        trip.hoster.firstname,
                                        trip.hoster.lastname,
                                    )}
                                </Text>
                            </View>
                        )}
                        <View className="ml-3 flex-1">
                            <Text className="text-slate-800 text-[13px] font-poppins-bold">
                                {trip.hoster.firstname} {trip.hoster.lastname}
                            </Text>
                            <View className="flex-row items-center mt-0.5">
                                <Text className="text-amber-500 text-[11px]">
                                    {renderStars(trip.hoster.avgRating)}
                                </Text>
                                <Text className="ml-1 text-slate-400 text-[11px] font-poppins-medium">
                                    ({trip.hoster.avgRating?.toFixed(1) ?? "0.0"})
                                </Text>
                            </View>
                        </View>
                        <Pressable
                            className="rounded-xl bg-blue-600 px-4 py-2 active:opacity-80"
                            style={{
                                shadowColor: "#2563EB",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Text className="text-white text-[12px] font-poppins-bold">
                                View
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}

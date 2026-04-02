import React, { useRef, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, Animated, Pressable, Dimensions, FlatList, ViewToken, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTripDetails } from "@/hooks/useTripDetails";
import { formatTripDate, getDurationDays, getTripTypeConfig, getInitials, renderStars } from "@/components/trips/helpers";
import { DetailedTrip, TripFile } from "@/components/trips/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function TripDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { trip, isLoading, error, refetch } = useTripDetails(id as string);

    const scrollY = useRef(new Animated.Value(0)).current;

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-4">
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
                <Text className="text-[16px] font-poppins-bold text-slate-800">Loading details...</Text>
            </SafeAreaView>
        );
    }

    if (error || !trip) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
                <Text className="text-[18px] font-poppins-bold text-slate-800">Failed to load trip</Text>
                <Text className="text-[14px] text-slate-500 mt-2">{error}</Text>
                <Pressable onPress={() => router.back()} className="mt-4 bg-slate-200 px-4 py-2 rounded-lg">
                    <Text className="font-poppins-semibold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header / Back Button floating */}
            <View className="absolute top-12 left-4 z-10">
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
            </View>

            <Animated.ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Hero Carousel */}
                <HeroCarousel files={trip.files_trip ?? []} type={trip.type_trip} />

                <View className="px-5 pt-6 pb-6 bg-white rounded-t-3xl -mt-6">
                    {/* Basic Info */}
                    <Text className="text-[24px] font-poppins-bold text-slate-900 leading-8">
                        {trip.title_trip}
                    </Text>
                    
                    <View className="flex-row items-center mt-3 gap-4">
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="calendar-month-outline" size={16} color="#64748B" />
                            <Text className="ml-1.5 text-slate-600 text-[13px] font-poppins-medium">
                                {formatTripDate(trip.date_depart)}
                            </Text>
                        </View>
                        {trip.destination && trip.destination.length > 0 && (
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="clock-outline" size={16} color="#64748B" />
                                <Text className="ml-1.5 text-slate-600 text-[13px] font-poppins-medium">
                                    {getDurationDays(trip.destination[0].date_start, trip.destination[0].date_end) ?? "?"} Days
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Keywords/Categories */}
                    <View className="mt-4 flex-row flex-wrap gap-2">
                        {(trip.mot_cle ?? []).map(k => (
                            <View key={k} className="bg-slate-100 rounded-full px-3 py-1.5">
                                <Text className="text-slate-700 text-[12px] font-poppins-semibold">#{k}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Description */}
                    <View className="mt-6">
                        <Text className="text-[16px] font-poppins-bold text-slate-900 mb-2">Overview</Text>
                        <Text className="text-[14px] font-poppins-regular text-slate-600 leading-6">
                            {trip.desc_trip}
                        </Text>
                        {trip.note_special && (
                            <View className="mt-3 bg-amber-50 rounded-xl p-3 flex-row">
                                <MaterialCommunityIcons name="information-outline" size={20} color="#D97706" />
                                <Text className="flex-1 ml-2 text-amber-800 text-[13px] font-poppins-medium leading-5">
                                    <Text className="font-poppins-bold">Note: </Text>
                                    {trip.note_special}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Includes Section */}
                    {trip.includes && trip.includes.length > 0 && (
                        <View className="mt-6">
                            <Text className="text-[16px] font-poppins-bold text-slate-900 mb-3">Included</Text>
                            <View className="gap-y-3">
                                {trip.includes.map((inc, i) => (
                                    <View key={i} className="flex-row items-center">
                                        <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3">
                                            <MaterialCommunityIcons 
                                                name={inc.type === 'transport' ? 'bus' : inc.type === 'meal' ? 'silverware-fork-knife' : 'check'} 
                                                size={16} 
                                                color="#059669" 
                                            />
                                        </View>
                                        <Text className="flex-1 text-slate-700 text-[14px] font-poppins-medium">{inc.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Destination Stays (Hebergements) */}
                    {trip.destination && trip.destination.length > 0 && trip.destination[0].hebergement && trip.destination[0].hebergement.length > 0 && (
                        <View className="mt-8">
                            <Text className="text-[16px] font-poppins-bold text-slate-900 mb-3">Where You'll Stay</Text>
                            <View className="gap-y-4">
                                {trip.destination[0].hebergement.map((stay, idx) => {
                                    const hData = stay.hebergement_data;
                                    if (!hData) return null;
                                    
                                    return (
                                        <View key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                                            {hData.files && hData.files.length > 0 && (
                                                <Image 
                                                    source={{ uri: hData.files[0].link }} 
                                                    className="w-full h-40" 
                                                    resizeMode="cover" 
                                                />
                                            )}
                                            <View className="p-4">
                                                <View className="flex-row items-center justify-between">
                                                    <Text className="text-[16px] font-poppins-bold text-slate-900 flex-1">{hData.name}</Text>
                                                    <View className="bg-blue-50 px-2 py-1 rounded">
                                                        <Text className="text-blue-700 text-[10px] font-poppins-bold uppercase">{hData.type}</Text>
                                                    </View>
                                                </View>
                                                
                                                {hData.description && (
                                                    <Text className="mt-2 text-[13px] text-slate-600 font-poppins-regular leading-5" numberOfLines={3}>
                                                        {hData.description}
                                                    </Text>
                                                )}
                                                
                                                {(hData.services && hData.services.length > 0) && (
                                                    <View className="mt-3 flex-row flex-wrap gap-2">
                                                        {hData.services.filter(s => s.status).map((srv, i) => (
                                                            <View key={i} className="flex-row items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                                <MaterialCommunityIcons 
                                                                    name={srv.name.toLowerCase().includes('wifi') ? 'wifi' : 'check'} 
                                                                    size={12} 
                                                                    color="#64748B" 
                                                                />
                                                                <Text className="ml-1 text-slate-500 text-[11px] font-poppins-medium">{srv.name}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Hoster Info */}
                    {trip.hoster && (
                        <View className="mt-8 border border-slate-100 bg-slate-50 rounded-2xl p-4">
                            <Text className="text-[13px] font-poppins-bold text-slate-500 uppercase tracking-wider mb-3">Hosted By</Text>
                            <View className="flex-row">
                                {trip.hoster.imageProfile ? (
                                    <Image source={{ uri: trip.hoster.imageProfile }} className="w-14 h-14 rounded-full" />
                                ) : (
                                    <View className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center">
                                        <Text className="text-white text-[16px] font-poppins-bold">{getInitials(trip.hoster.firstname, trip.hoster.lastname)}</Text>
                                    </View>
                                )}
                                <View className="ml-3 flex-1 justify-center">
                                    <Text className="text-[16px] font-poppins-bold text-slate-900">{trip.hoster.firstname} {trip.hoster.lastname}</Text>
                                    <Text className="text-[13px] font-poppins-medium text-blue-600 mt-0.5">@{trip.hoster.uniqueName}</Text>
                                </View>
                            </View>
                            {trip.hoster.about && (
                                <Text className="mt-3 text-[13px] text-slate-600 font-poppins-regular leading-5">
                                    {trip.hoster.about}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </Animated.ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-5 pt-3 pb-8 flex-row items-center justify-between shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
                 <View>
                    <Text className="text-[11px] font-poppins-semibold text-slate-500 uppercase">Starts from</Text>
                    <Text className="text-[18px] font-poppins-bold text-slate-900 mt-0.5">{trip.destination?.[0]?.location?.ville}</Text>
                 </View>
                 <Pressable className="bg-blue-600 px-8 py-3.5 rounded-full items-center justify-center flex-row">
                     <MaterialCommunityIcons name="calendar-check" size={18} color="white" />
                     <Text className="text-white font-poppins-bold text-[15px] ml-2">Book Trip</Text>
                 </Pressable>
            </View>
        </View>
    );
}

// Sub-component for Hero Carousel to keep it clean
function HeroCarousel({ files, type }: { files: TripFile[], type?: string }) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(0);
    const typeConfig = getTripTypeConfig(type);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0]?.index != null) setActiveIndex(viewableItems[0].index);
    }, []);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <View className="h-96 w-full relative">
            <FlatList
                data={files}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id ?? index.toString()}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.link }} style={{ width: SCREEN_WIDTH, height: 384 }} resizeMode="cover" />
                )}
            />
            {/* Gradient Overlay */}
            <LinearGradient
                colors={["rgba(0,0,0,0.5)", "transparent", "transparent", "rgba(0,0,0,0.4)"]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none"
            />
            
            {/* Badge */}
            <View className="absolute bottom-10 right-4 px-3 py-1.5 rounded-full bg-black/60 flex-row items-center border border-white/20">
                 <MaterialCommunityIcons name={typeConfig.icon} size={14} color="#FFF" />
                 <Text className="ml-1.5 text-white text-[11px] font-poppins-bold uppercase tracking-wider">{typeConfig.label}</Text>
            </View>

            {/* Dots */}
            {files.length > 1 && (
                <View className="absolute bottom-10 left-0 right-0 flex-row justify-center space-x-1.5">
                    {files.map((_, i) => (
                        <View key={i} className={`h-1.5 rounded-full ${activeIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
                    ))}
                </View>
            )}
        </View>
    );
}

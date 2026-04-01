import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiService } from "@/services/api";

type HomeFile = {
  name?: string;
  link?: string;
  urlfile?: string;
};

type HomeFeature = {
  name: string;
  description?: string;
  status?: boolean;
};

type Accommodation = {
  _id: string;
  type: string;
  name: string;
  files?: HomeFile[];
  services?: HomeFeature[];
  options?: HomeFeature[];
  is_active?: boolean;
};

type ProfileLanguage = {
  langue: string;
  level: number;
};

type Profile = {
  _id: string;
  firstname: string;
  lastname: string;
  uniqueName?: string;
  imageProfile?: string;
  biography?: string;
  speciality?: string[];
  language?: ProfileLanguage[];
  avgRating?: number | null;
  tripCount?: number;
};

type TripHoster = {
  firstname?: string;
  lastname?: string;
  avgRating?: number;
  imageProfile?: string;
};

type TripMedia = {
  id?: string;
  link: string;
  favorite?: boolean;
};

type TripDestination = {
  id?: string;
  location?: {
    pays?: string;
    ville?: string;
  };
  date_start?: string;
  date_end?: string;
};

type Trip = {
  _id: string;
  title_trip: string;
  desc_trip?: string;
  type_trip?: string;
  categories?: string[];
  date_depart?: string;
  files_trip?: TripMedia[];
  destination?: TripDestination[];
  includes?: { type?: string; value?: string }[];
  hoster?: TripHoster;
  hebergements?: Accommodation[];
};

type CountryNearby = {
  _id: string;
  nom: string;
  code: string;
  files?: {
    urlfile?: string;
    name?: string;
    description?: string;
  }[];
};

type HomeActivityResponse = {
  accomodations: Accommodation[];
  profiles: Profile[];
  trips: Trip[];
  countriesNearby: CountryNearby[];
};

const DEFAULT_ZONE = {
  minLon: 7.52,
  minLat: 30.31,
  maxLon: 11.49,
  maxLat: 37.35,
};

const ICON_COLORS = {
  primary: "#0F766E",
  neutral: "#64748B",
  danger: "#DC2626",
};

const formatDate = (value?: string) => {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be confirmed";
  return date.toLocaleDateString();
};

const getInitials = (first?: string, last?: string) => {
  const firstLetter = first?.trim().charAt(0).toUpperCase() ?? "";
  const lastLetter = last?.trim().charAt(0).toUpperCase() ?? "";
  const result = `${firstLetter}${lastLetter}`.trim();
  return result || "TR";
};

const SectionHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}) => (
  <View className="mt-7 mb-3 px-4 flex-row items-center justify-between">
    <Text className="text-slate-900 text-[22px] font-extrabold tracking-tight">
      {title}
    </Text>
    <View className="h-9 w-9 rounded-xl border border-teal-200 bg-teal-50 items-center justify-center">
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={ICON_COLORS.primary}
      />
    </View>
  </View>
);

const HomeScreen = () => {
  const [data, setData] = useState<HomeActivityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeActivity = useCallback(async () => {
    try {
      setError(null);
      const zone = encodeURIComponent(JSON.stringify(DEFAULT_ZONE));
      const response = await apiService.request<HomeActivityResponse>(
        `preferences/home-activity/?zone=${zone}`,
      );
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load travel content";
      setError(message);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchHomeActivity();
      setIsLoading(false);
    };

    void load();
  }, [fetchHomeActivity]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchHomeActivity();
    setIsRefreshing(false);
  }, [fetchHomeActivity]);

  const stats = useMemo(
    () => ({
      trips: data?.trips?.length ?? 0,
      guides: data?.profiles?.length ?? 0,
      stays: data?.accomodations?.length ?? 0,
      countries: data?.countriesNearby?.length ?? 0,
    }),
    [data],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 px-6">
        <ActivityIndicator size="large" color={ICON_COLORS.primary} />
        <Text className="mt-3 text-slate-500 text-[15px] font-medium">
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
          color={ICON_COLORS.danger}
        />
        <Text className="mt-2 text-red-700 text-[20px] font-extrabold text-center">
          Unable to load home activity
        </Text>
        <Text className="mt-2 text-red-600 text-center">{error}</Text>
        <Pressable
          className="mt-5 rounded-full bg-red-600 px-5 py-3 active:opacity-80"
          onPress={() => void fetchHomeActivity()}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
      >
        <View className="mx-4 mt-3 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <Text className="text-teal-300 text-[12px] font-bold tracking-[1.8px]">
            NEOVASION TRAVEL
          </Text>
          <Text className="mt-2 text-white text-[30px] font-black leading-9">
            Discover your next unforgettable journey
          </Text>
          <Text className="mt-3 text-slate-300 text-[14px] leading-5">
            Hand-picked trips, local guides, and accommodations around your
            selected zone.
          </Text>

          <View className="mt-5 flex-row flex-wrap justify-between gap-y-2">
            <View className="basis-[48%] rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3">
              <Text className="text-white text-[19px] font-black">
                {stats.trips}
              </Text>
              <Text className="mt-1 text-slate-300 text-[12px] font-semibold">
                Trips
              </Text>
            </View>
            <View className="basis-[48%] rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3">
              <Text className="text-white text-[19px] font-black">
                {stats.stays}
              </Text>
              <Text className="mt-1 text-slate-300 text-[12px] font-semibold">
                Stays
              </Text>
            </View>
            <View className="basis-[48%] rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3">
              <Text className="text-white text-[19px] font-black">
                {stats.guides}
              </Text>
              <Text className="mt-1 text-slate-300 text-[12px] font-semibold">
                Guides
              </Text>
            </View>
            <View className="basis-[48%] rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3">
              <Text className="text-white text-[19px] font-black">
                {stats.countries}
              </Text>
              <Text className="mt-1 text-slate-300 text-[12px] font-semibold">
                Countries
              </Text>
            </View>
          </View>
        </View>

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
          renderItem={({ item }) => {
            const media = item.files?.[0];
            return (
              <View className="mr-3 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {!!media?.urlfile && (
                  <Image
                    source={{ uri: media.urlfile }}
                    className="h-28 w-full"
                    resizeMode="cover"
                  />
                )}
                <View className="p-3">
                  <Text className="text-slate-900 text-[17px] font-extrabold">
                    {item.nom}
                  </Text>
                  <Text className="mt-1 text-teal-700 text-[12px] font-bold uppercase">
                    {item.code}
                  </Text>
                  {!!media?.name && (
                    <Text
                      className="mt-2 text-slate-500 text-[12px]"
                      numberOfLines={1}
                    >
                      {media.name}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
        />

        <SectionHeader title="Featured Trips" icon="airplane-takeoff" />
        {(data?.trips ?? []).map((trip) => {
          const cover = trip.files_trip?.[0]?.link;
          const destination = trip.destination?.[0]?.location;
          return (
            <View
              key={trip._id}
              className="mx-4 mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white"
            >
              {!!cover && (
                <Image
                  source={{ uri: cover }}
                  className="h-48 w-full"
                  resizeMode="cover"
                />
              )}
              <View className="p-4">
                <Text className="text-teal-700 text-[11px] font-extrabold tracking-[1.2px]">
                  {(trip.type_trip || "Trip").toUpperCase()}
                </Text>
                <Text className="mt-1 text-slate-900 text-[23px] font-black leading-7">
                  {trip.title_trip}
                </Text>
                <Text
                  className="mt-2 text-slate-600 text-[14px] leading-5"
                  numberOfLines={3}
                >
                  {trip.desc_trip || "No description available"}
                </Text>

                <View className="mt-3 flex-row items-center">
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={16}
                    color={ICON_COLORS.neutral}
                  />
                  <Text className="ml-2 text-slate-500 text-[13px]">
                    {formatDate(trip.date_depart)}
                  </Text>
                </View>

                <View className="mt-2 flex-row items-center">
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color={ICON_COLORS.neutral}
                  />
                  <Text className="ml-2 text-slate-500 text-[13px]">
                    {destination?.ville || "Unknown city"} -{" "}
                    {destination?.pays || "Unknown country"}
                  </Text>
                </View>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  {(trip.categories ?? []).slice(0, 2).map((category) => (
                    <View
                      key={category}
                      className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1"
                    >
                      <Text className="text-teal-700 text-[11px] font-bold">
                        {category}
                      </Text>
                    </View>
                  ))}
                </View>

                {!!trip.hoster && (
                  <View className="mt-4 flex-row items-center">
                    {!!trip.hoster.imageProfile ? (
                      <Image
                        source={{ uri: trip.hoster.imageProfile }}
                        className="h-11 w-11 rounded-full"
                      />
                    ) : (
                      <View className="h-11 w-11 rounded-full bg-teal-700 items-center justify-center">
                        <Text className="text-white text-[13px] font-extrabold">
                          {getInitials(
                            trip.hoster.firstname,
                            trip.hoster.lastname,
                          )}
                        </Text>
                      </View>
                    )}
                    <View className="ml-3">
                      <Text className="text-slate-900 text-[14px] font-bold">
                        {trip.hoster.firstname} {trip.hoster.lastname}
                      </Text>
                      <Text className="mt-0.5 text-slate-500 text-[12px]">
                        Rating: {trip.hoster.avgRating ?? 0}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <SectionHeader title="Top Accommodations" icon="bed-queen-outline" />
        <FlatList
          data={data?.accomodations ?? []}
          horizontal
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="pl-4 pr-2"
          removeClippedSubviews
          renderItem={({ item }) => {
            const media = item.files?.[0]?.link;
            const availableServices = (item.services ?? []).filter(
              (entry) => entry.status,
            );
            const availableOptions = (item.options ?? []).filter(
              (entry) => entry.status,
            );

            return (
              <View className="mr-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                {!!media && (
                  <Image
                    source={{ uri: media }}
                    className="h-36 w-full"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4">
                  <Text className="text-teal-700 text-[11px] font-extrabold uppercase tracking-[1px]">
                    {item.type}
                  </Text>
                  <Text
                    className="mt-1 text-slate-900 text-[18px] font-black"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text className="mt-3 text-slate-900 text-[13px] font-bold">
                    Services
                  </Text>
                  {(availableServices.length > 0
                    ? availableServices
                    : (item.services ?? [])
                  )
                    .slice(0, 2)
                    .map((service) => (
                      <Text
                        key={service.name}
                        className="mt-1 text-slate-500 text-[12px]"
                        numberOfLines={1}
                      >
                        - {service.name}
                      </Text>
                    ))}

                  <Text className="mt-3 text-slate-900 text-[13px] font-bold">
                    Options
                  </Text>
                  {(availableOptions.length > 0
                    ? availableOptions
                    : (item.options ?? [])
                  )
                    .slice(0, 2)
                    .map((option) => (
                      <Text
                        key={option.name}
                        className="mt-1 text-slate-500 text-[12px]"
                        numberOfLines={1}
                      >
                        - {option.name}
                      </Text>
                    ))}
                </View>
              </View>
            );
          }}
        />

        <SectionHeader title="Local Guides" icon="account-group-outline" />
        {(data?.profiles ?? []).map((profile) => (
          <View
            key={profile._id}
            className="mx-4 mb-3 rounded-2xl border border-slate-200 bg-white p-4 flex-row"
          >
            {!!profile.imageProfile ? (
              <Image
                source={{ uri: profile.imageProfile }}
                className="h-14 w-14 rounded-full"
              />
            ) : (
              <View className="h-14 w-14 rounded-full items-center justify-center bg-teal-700">
                <Text className="text-white text-[16px] font-extrabold">
                  {getInitials(profile.firstname, profile.lastname)}
                </Text>
              </View>
            )}

            <View className="ml-3 flex-1">
              <Text className="text-slate-900 text-[17px] font-extrabold">
                {profile.firstname} {profile.lastname}
              </Text>
              <Text className="mt-0.5 text-teal-700 text-[12px] font-bold">
                @{profile.uniqueName || "traveler"}
              </Text>
              <Text
                className="mt-2 text-slate-500 text-[13px] leading-5"
                numberOfLines={2}
              >
                {profile.biography || "No biography available."}
              </Text>

              <View className="mt-3 flex-row flex-wrap gap-2">
                <Text className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700 text-[12px] font-bold">
                  {"\u2605"} {profile.avgRating ?? 0}
                </Text>
                <Text className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700 text-[12px] font-bold">
                  {profile.tripCount ?? 0} trips
                </Text>
              </View>

              <View className="mt-3 flex-row flex-wrap gap-2">
                {(profile.speciality ?? []).slice(0, 2).map((item) => (
                  <View
                    key={item}
                    className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1"
                  >
                    <Text className="text-teal-700 text-[11px] font-bold">
                      {item}
                    </Text>
                  </View>
                ))}
                {(profile.language ?? []).slice(0, 2).map((lang) => (
                  <View
                    key={`${lang.langue}-${lang.level}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
                  >
                    <Text className="text-slate-600 text-[11px] font-semibold">
                      {lang.langue} - {lang.level}/5
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

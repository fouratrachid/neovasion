import React from "react";
import { Image, Text, View } from "react-native";

import { getInitials } from "./helpers";
import { Profile } from "./types";

type GuideCardProps = {
  profile: Profile;
};

export default function GuideCard({ profile }: GuideCardProps) {
  return (
    <View className="mx-4 mb-3 flex-row rounded-2xl border border-slate-200 bg-white p-4">
      {!!profile.imageProfile ? (
        <Image
          source={{ uri: profile.imageProfile }}
          className="h-14 w-14 rounded-full"
        />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-700">
          <Text className="text-white text-[16px] font-poppins-bold">
            {getInitials(profile.firstname, profile.lastname)}
          </Text>
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-slate-900 text-[17px] font-poppins-bold">
          {profile.firstname} {profile.lastname}
        </Text>
        <Text className="mt-0.5 text-blue-700 text-[12px] font-poppins-bold">
          @{profile.uniqueName || "traveler"}
        </Text>
        <Text
          className="mt-2 text-slate-500 text-[13px] leading-5"
          numberOfLines={2}
        >
          {profile.biography || "No biography available."}
        </Text>

        <View className="mt-3 flex-row flex-wrap gap-2">
          <Text className="rounded-full px-2.5 py-1 text-emerald-700 text-[12px] font-poppins-bold">
            {"\u2605"} {profile.avgRating ?? 0}
          </Text>
          <Text className="rounded-full  px-2.5 py-1 text-amber-700 text-[12px] font-poppins-bold">
            {profile.tripCount ?? 0} trips
          </Text>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {(profile.speciality ?? []).slice(0, 2).map((item) => (
            <View
              key={item}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1"
            >
              <Text className="text-blue-700 text-[11px] font-poppins-bold">
                {item}
              </Text>
            </View>
          ))}
          {(profile.language ?? []).slice(0, 2).map((lang) => (
            <View
              key={`${lang.langue}-${lang.level}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
            >
              <Text className="text-slate-600 text-[11px] font-poppins-semibold">
                {lang.langue} - {lang.level}/5
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

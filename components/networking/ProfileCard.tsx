import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Profile } from "./types";

interface ProfileCardProps {
  profile: Profile;
  onPress?: () => void;
}

export default function ProfileCard({ profile, onPress }: ProfileCardProps) {
  const fullName =
    `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim();
  const userName = profile.uniqueName ? `@${profile.uniqueName}` : "@traveler";

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100"
    >
      <View className="p-4 flex-row items-start">
        <Image
          source={{
            uri:
              profile.imageProfile ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(fullName),
          }}
          className="h-16 w-16 rounded-full bg-slate-200"
        />
        <View className="ml-4 flex-1">
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="text-[16px] font-poppins-bold text-slate-900"
                numberOfLines={1}
              >
                {fullName}
              </Text>
              <Text className="text-[13px] font-poppins-regular text-slate-500">
                {userName}
              </Text>
            </View>
            <View className="flex-row items-center rounded-full bg-blue-50 px-2.5 py-1">
              <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
              <Text className="ml-1 text-[12px] font-poppins-semi-bold text-slate-700">
                {profile.avgRating ? profile.avgRating.toFixed(1) : "New"}
              </Text>
            </View>
          </View>

          {profile.speciality && profile.speciality.length > 0 && (
            <View className="mt-2 flex-row flex-wrap gap-2">
              {profile.speciality.slice(0, 2).map((spec, index) => (
                <View key={index} className="rounded-md bg-slate-100 px-2 py-1">
                  <Text className="text-[10px] font-poppins-medium text-slate-600">
                    {spec}
                  </Text>
                </View>
              ))}
              {profile.speciality.length > 2 && (
                <View className="rounded-md bg-slate-100 px-2 py-1">
                  <Text className="text-[10px] font-poppins-medium text-slate-600">
                    +{profile.speciality.length - 2}
                  </Text>
                </View>
              )}
            </View>
          )}

          {profile.biography ? (
            <Text
              className="mt-2 text-[13px] font-poppins-regular text-slate-600"
              numberOfLines={2}
            >
              {profile.biography}
            </Text>
          ) : (
            <Text
              className="mt-2 text-[13px] font-poppins-regular text-slate-400 italic"
              numberOfLines={1}
            >
              No biography provided
            </Text>
          )}

          <View className="mt-3 flex-row items-center justify-between border-t border-slate-50 pt-3">
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="account-group-outline"
                size={16}
                color="#64748B"
              />
              <Text className="text-[12px] font-poppins-medium text-slate-500">
                {profile.followerCount ?? 0}{" "}
                {profile.followerCount === 1 ? "Follower" : "Followers"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="map-marker-path"
                size={16}
                color="#64748B"
              />
              <Text className="text-[12px] font-poppins-medium text-slate-500">
                {profile.tripCount ?? 0}{" "}
                {profile.tripCount === 1 ? "Trip" : "Trips"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

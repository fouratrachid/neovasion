import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNetworkingProfileParams } from "@/hooks/useUserProfileDetails";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import NetworkingPostCard from "@/components/networking/NetworkingPostCard";

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "posts" | "trips" | "gallery" | "about"
  >("posts");

  const {
    profileData,
    headerData,
    tripsData,
    postsData,
    filesData,
    isLoading,
    error,
    refetch,
  } = useNetworkingProfileParams(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (error || !profileData) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color="#DC2626"
        />
        <Text className="mt-4 text-center font-poppins-bold text-xl text-slate-800">
          Profile Not Found
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-slate-900 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-poppins-bold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const {
    firstname,
    lastname,
    imageProfile,
    uniqueName,
    biography,
    speciality,
    language,
    email,
    phoneNumber,
  } = profileData;
  const fullName =
    `${firstname || headerData?.firstname || ""} ${lastname || headerData?.lastname || ""}`.trim();
  const displayImage =
    imageProfile ||
    headerData?.imageProfile ||
    "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="bg-white flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
          <Pressable
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full bg-slate-100"
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </Pressable>
          <Text className="ml-3 font-poppins-bold text-lg text-slate-900">
            {uniqueName || fullName}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Info */}
          <View className="px-6 py-6 items-center border-b border-slate-100">
            <Image
              source={{ uri: displayImage }}
              className="w-24 h-24 rounded-full bg-slate-200 border-2 border-white shadow-sm"
            />
            <Text className="mt-4 text-2xl font-poppins-bold text-slate-900">
              {fullName}
            </Text>
            <Text className="text-sm font-poppins-medium text-slate-500">
              @{uniqueName}
            </Text>

            {biography ? (
              <Text className="mt-3 text-center text-sm font-poppins-regular text-slate-600 px-4 leading-6">
                {biography}
              </Text>
            ) : null}

            {/* Interactive Stats row */}
            <View className="flex-row items-center gap-8 mt-6">
              <View className="items-center">
                <Text className="font-poppins-bold text-lg text-slate-900">
                  {postsData?.length || 0}
                </Text>
                <Text className="font-poppins-medium text-xs text-slate-500">
                  Posts
                </Text>
              </View>
              <View className="items-center border-l border-r border-slate-200 px-8">
                <Text className="font-poppins-bold text-lg text-slate-900">
                  {profileData?.follows?.length || 0}
                </Text>
                <Text className="font-poppins-medium text-xs text-slate-500">
                  Following
                </Text>
              </View>
              <View className="items-center">
                <Text className="font-poppins-bold text-lg text-slate-900">
                  {tripsData?.length || 0}
                </Text>
                <Text className="font-poppins-medium text-xs text-slate-500">
                  Trips
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-slate-200 mt-2 px-4"
          >
            <Pressable
              onPress={() => setActiveTab("posts")}
              className={`py-4 px-4 items-center border-b-2 ${activeTab === "posts" ? "border-blue-600" : "border-transparent"}`}
            >
              <Text
                className={`font-poppins-semi-bold ${activeTab === "posts" ? "text-blue-600" : "text-slate-500"}`}
              >
                Posts
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("trips")}
              className={`py-4 px-4 items-center border-b-2 ${activeTab === "trips" ? "border-blue-600" : "border-transparent"}`}
            >
              <Text
                className={`font-poppins-semi-bold ${activeTab === "trips" ? "text-blue-600" : "text-slate-500"}`}
              >
                Trips
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("gallery")}
              className={`py-4 px-4 items-center border-b-2 ${activeTab === "gallery" ? "border-blue-600" : "border-transparent"}`}
            >
              <Text
                className={`font-poppins-semi-bold ${activeTab === "gallery" ? "text-blue-600" : "text-slate-500"}`}
              >
                Gallery
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("about")}
              className={`py-4 px-4 items-center border-b-2 ${activeTab === "about" ? "border-blue-600" : "border-transparent"}`}
            >
              <Text
                className={`font-poppins-semi-bold ${activeTab === "about" ? "text-blue-600" : "text-slate-500"}`}
              >
                About
              </Text>
            </Pressable>
          </ScrollView>

          {/* Tab Content */}
          <View className="bg-white min-h-[400px]">
            {activeTab === "posts" && (
              <View className="pt-2">
                {postsData?.length > 0 ? (
                  postsData.map((post: any) => (
                    <View key={post._id} className="mb-2">
                      {/* Injecting hoster info artificially since endpoint might miss it for nested posts */}
                      <NetworkingPostCard
                        post={{
                          ...post,
                          hoster: {
                            firstname,
                            lastname,
                            imageProfile,
                            uniqueName,
                          },
                        }}
                      />
                    </View>
                  ))
                ) : (
                  <View className="py-12 items-center">
                    <MaterialCommunityIcons
                      name="image-off-outline"
                      size={48}
                      color="#CBD5E1"
                    />
                    <Text className="mt-4 font-poppins-medium text-slate-500">
                      No posts yet.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === "trips" && (
              <View className="px-4 py-6">
                {tripsData?.length > 0 ? (
                  tripsData.map((trip: any) => (
                    <View
                      key={trip._id}
                      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100"
                    >
                      <Text className="font-poppins-bold text-lg text-slate-900">
                        {trip.title_trip}
                      </Text>
                      <Text
                        className="mt-1 font-poppins-regular text-sm text-slate-600"
                        numberOfLines={2}
                      >
                        {trip.desc_trip}
                      </Text>
                      <View className="flex-row items-center mt-3 pt-3 border-t border-slate-100 justify-between">
                        <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
                          <MaterialCommunityIcons
                            name="tag-outline"
                            size={14}
                            color="#2563EB"
                          />
                          <Text className="ml-1 font-poppins-medium text-xs text-blue-700">
                            {trip.type_trip}
                          </Text>
                        </View>
                        <Pressable className="bg-slate-900 px-4 py-1.5 rounded-full">
                          <Text className="text-white font-poppins-medium text-xs">
                            View Trip
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="py-12 items-center">
                    <MaterialCommunityIcons
                      name="map-marker-off-outline"
                      size={48}
                      color="#CBD5E1"
                    />
                    <Text className="mt-4 font-poppins-medium text-slate-500">
                      No trips planned yet.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === "gallery" && (
              <View className="px-4 py-4 pt-6 flex-row flex-wrap justify-between">
                {filesData?.length > 0 ? (
                  filesData.map((file: any, index: number) => {
                    const isImage =
                      file.type === "image" ||
                      file.url.match(/\.(jpeg|jpg|gif|png)$/) != null;
                    const width = (Dimensions.get("window").width - 48) / 2; // Two columns, subtracting padding

                    return (
                      <Pressable
                        key={file._id || index}
                        className="mb-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                        style={{ width: "48%" }}
                        onPress={() =>
                          file.url && Linking.openURL(file.url).catch(() => {})
                        }
                      >
                        {isImage ? (
                          <Image
                            source={{ uri: file.url }}
                            style={{ width: "100%", height: width }}
                            className="bg-slate-200"
                          />
                        ) : (
                          <View
                            style={{ width: "100%", height: width }}
                            className="bg-slate-100 items-center justify-center"
                          >
                            <MaterialCommunityIcons
                              name="file-document-outline"
                              size={40}
                              color="#94A3B8"
                            />
                            <Text
                              className="mt-2 font-poppins-medium text-xs text-slate-500 text-center px-2"
                              numberOfLines={2}
                            >
                              {file.fileName || "Document"}
                            </Text>
                          </View>
                        )}
                        <View className="absolute top-2 right-2 bg-black/40 rounded-full p-1.5">
                          <MaterialCommunityIcons
                            name={isImage ? "image" : "file"}
                            size={14}
                            color="white"
                          />
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <View className="flex-1 py-12 items-center w-full">
                    <MaterialCommunityIcons
                      name="folder-multiple-image"
                      size={48}
                      color="#CBD5E1"
                    />
                    <Text className="mt-4 font-poppins-medium text-slate-500">
                      No media found.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === "about" && (
              <View className="px-6 py-6 gap-6">
                {speciality?.length > 0 && (
                  <View>
                    <Text className="font-poppins-bold text-[15px] text-slate-900 mb-3">
                      Specialities
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {speciality.map((spec: string, idx: number) => (
                        <View
                          key={idx}
                          className="bg-white px-4 py-2 rounded-full border border-slate-200"
                        >
                          <Text className="font-poppins-medium text-[13px] text-slate-700">
                            {spec}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {language?.length > 0 && (
                  <View>
                    <Text className="font-poppins-bold text-[15px] text-slate-900 mb-3">
                      Languages
                    </Text>
                    <View className="gap-2 border border-slate-200 bg-white rounded-2xl overflow-hidden">
                      {language.map((lang: any, idx: number) => (
                        <View
                          key={idx}
                          className={`flex-row justify-between items-center px-4 py-3 ${idx !== language.length - 1 ? "border-b border-slate-100" : ""}`}
                        >
                          <Text className="font-poppins-medium text-slate-700">
                            {lang.langue}
                          </Text>
                          <View className="flex-row items-center">
                            <MaterialCommunityIcons
                              name="star"
                              size={14}
                              color="#F59E0B"
                            />
                            <Text className="ml-1 font-poppins-semi-bold text-slate-900">
                              {lang.level}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View>
                  <Text className="font-poppins-bold text-[15px] text-slate-900 mb-3">
                    Contact
                  </Text>
                  <View className="bg-white p-4 rounded-2xl border border-slate-200 gap-4">
                    {email && (
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                          <MaterialCommunityIcons
                            name="email-outline"
                            size={20}
                            color="#2563EB"
                          />
                        </View>
                        <Text className="font-poppins-medium text-slate-700">
                          {email}
                        </Text>
                      </View>
                    )}
                    {phoneNumber && (
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center">
                          <MaterialCommunityIcons
                            name="phone-outline"
                            size={20}
                            color="#16A34A"
                          />
                        </View>
                        <Text className="font-poppins-medium text-slate-700">
                          {phoneNumber}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

import React, { memo, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Dimensions,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Video } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { SafeImage } from "@/components/SafeImage";
import { useLocationName } from "@/hooks/useLocationName";
import { NetworkingPost, NetworkingMedia } from "./types";

dayjs.extend(relativeTime);

type NetworkingPostCardProps = {
  post: NetworkingPost;
};

const getInitials = (first?: string, last?: string): string => {
  const firstLetter = first?.trim()?.charAt(0)?.toUpperCase() ?? "";
  const lastLetter = last?.trim()?.charAt(0)?.toUpperCase() ?? "";
  return `${firstLetter}${lastLetter}` || "U";
};

// --- Helper function to detect video media ---
const isVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|mov|m3u8)$/i.test(url) || url.includes("youtu");
};

const isVideoMedia = (media: NetworkingMedia): boolean => {
  return media.type?.toLowerCase() === "video" || isVideoUrl(media.link);
};

// --- Video Overlay Component ---
const VideoOverlay = () => {
  return (
    <View className="absolute inset-0 items-center justify-center bg-black/20">
      <View className="bg-white/30 backdrop-blur-sm p-3 rounded-full">
        <MaterialCommunityIcons name="play" size={32} color="white" />
      </View>
    </View>
  );
};

// --- Dynamic Media Gallery Component ---
const MediaGallery = ({
  media,
  format,
}: {
  media: NetworkingMedia[];
  format: string;
}) => {
  const { width } = useWindowDimensions();
  const GALLERY_WIDTH = width;
  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<Record<number, Video | null>>({});

  if (!media || media.length === 0) return null;

  // --- Single Media (Image or Video) ---
  if (media.length === 1 || format === "single") {
    const isVideo = isVideoMedia(media[0]);

    if (isVideo) {
      return (
        <View
          style={{ width: GALLERY_WIDTH, height: 320 }}
          className="bg-slate-900 relative"
        >
          <Video
            source={{ uri: media[0].link }}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay={false}
            isLooping={false}
            style={{ width: GALLERY_WIDTH, height: 320 }}
            onLoadStart={() =>
              setVideoLoading((prev) => ({ ...prev, 0: true }))
            }
            onLoad={() => setVideoLoading((prev) => ({ ...prev, 0: false }))}
            onError={() => setVideoLoading((prev) => ({ ...prev, 0: false }))}
          />
          <VideoOverlay />
          {videoLoading[0] && (
            <View className="absolute inset-0 items-center justify-center bg-black/40">
              <MaterialCommunityIcons name="loading" size={24} color="white" />
            </View>
          )}
        </View>
      );
    }

    return (
      <SafeImage
        source={media[0].link}
        style={{ width: GALLERY_WIDTH, height: 320 }}
        className="bg-slate-100"
        fallbackIcon="image"
        fallbackIconSize={32}
        resizeMode="cover"
      />
    );
  }

  // --- Left Large Right Two ---
  if (format === "left-large-right-two" && media.length >= 3) {
    const isLeftVideo = isVideoMedia(media[0]);
    const isTopRightVideo = isVideoMedia(media[1]);
    const isBottomRightVideo = isVideoMedia(media[2]);

    return (
      <View
        style={{
          width: GALLERY_WIDTH,
          height: 340,
          flexDirection: "row",
          gap: 2,
        }}
      >
        {/* Left Large */}
        <View style={{ flex: 2, position: "relative" }}>
          {isLeftVideo ? (
            <>
              <Video
                source={{ uri: media[0].link }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                shouldPlay={false}
                isLooping={false}
                style={{ width: "100%", height: "100%" }}
                onLoadStart={() =>
                  setVideoLoading((prev) => ({ ...prev, 0: true }))
                }
                onLoad={() =>
                  setVideoLoading((prev) => ({ ...prev, 0: false }))
                }
                onError={() =>
                  setVideoLoading((prev) => ({ ...prev, 0: false }))
                }
              />
              <VideoOverlay />
            </>
          ) : (
            <SafeImage
              source={media[0].link}
              className="w-full h-full bg-slate-100"
              resizeMode="cover"
            />
          )}
        </View>

        {/* Right Column */}
        <View style={{ flex: 1, gap: 2 }}>
          {/* Top Right */}
          <View style={{ flex: 1, position: "relative" }}>
            {isTopRightVideo ? (
              <>
                <Video
                  source={{ uri: media[1].link }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  resizeMode="cover"
                  shouldPlay={false}
                  isLooping={false}
                  style={{ width: "100%", height: "100%" }}
                  onLoadStart={() =>
                    setVideoLoading((prev) => ({ ...prev, 1: true }))
                  }
                  onLoad={() =>
                    setVideoLoading((prev) => ({ ...prev, 1: false }))
                  }
                  onError={() =>
                    setVideoLoading((prev) => ({ ...prev, 1: false }))
                  }
                />
                <VideoOverlay />
              </>
            ) : (
              <SafeImage
                source={media[1].link}
                className="w-full h-full bg-slate-100"
                resizeMode="cover"
              />
            )}
          </View>

          {/* Bottom Right */}
          <View style={{ flex: 1, position: "relative" }}>
            {isBottomRightVideo ? (
              <>
                <Video
                  source={{ uri: media[2].link }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  resizeMode="cover"
                  shouldPlay={false}
                  isLooping={false}
                  style={{ width: "100%", height: "100%" }}
                  onLoadStart={() =>
                    setVideoLoading((prev) => ({ ...prev, 2: true }))
                  }
                  onLoad={() =>
                    setVideoLoading((prev) => ({ ...prev, 2: false }))
                  }
                  onError={() =>
                    setVideoLoading((prev) => ({ ...prev, 2: false }))
                  }
                />
                <VideoOverlay />
              </>
            ) : (
              <SafeImage
                source={media[2].link}
                className="w-full h-full bg-slate-100"
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  // --- Grid 2x2 ---
  if (format === "grid-2x2" && media.length >= 4) {
    return (
      <View
        style={{
          width: GALLERY_WIDTH,
          height: 340,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {media.slice(0, 4).map((m, i) => {
          const isVideo = isVideoMedia(m);
          return (
            <View
              key={i}
              style={{
                width: GALLERY_WIDTH / 2 - 1,
                height: 169,
                position: "relative",
              }}
            >
              {isVideo ? (
                <>
                  <Video
                    source={{ uri: m.link }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{ width: "100%", height: "100%" }}
                    onLoadStart={() =>
                      setVideoLoading((prev) => ({ ...prev, i: true }))
                    }
                    onLoad={() =>
                      setVideoLoading((prev) => ({ ...prev, i: false }))
                    }
                    onError={() =>
                      setVideoLoading((prev) => ({ ...prev, i: false }))
                    }
                  />
                  <VideoOverlay />
                </>
              ) : (
                <SafeImage
                  source={m.link}
                  className="w-full h-full bg-slate-100"
                  resizeMode="cover"
                />
              )}
            </View>
          );
        })}
      </View>
    );
  }

  // --- Carousel (Multiple media, default) ---
  return (
    <View style={{ width: GALLERY_WIDTH, height: 320 }}>
      <FlatList
        data={media}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => {
          const isVideo = isVideoMedia(item);

          if (isVideo) {
            return (
              <View
                style={{
                  width: GALLERY_WIDTH,
                  height: 320,
                  position: "relative",
                }}
                className="bg-slate-900"
              >
                <Video
                  source={{ uri: item.link }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  resizeMode="cover"
                  shouldPlay={false}
                  isLooping={false}
                  style={{ width: GALLERY_WIDTH, height: 320 }}
                  onLoadStart={() =>
                    setVideoLoading((prev) => ({ ...prev, index: true }))
                  }
                  onLoad={() =>
                    setVideoLoading((prev) => ({ ...prev, index: false }))
                  }
                  onError={() =>
                    setVideoLoading((prev) => ({ ...prev, index: false }))
                  }
                />
                <VideoOverlay />
                {videoLoading[index] && (
                  <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <MaterialCommunityIcons
                      name="loading"
                      size={24}
                      color="white"
                    />
                  </View>
                )}
              </View>
            );
          }

          return (
            <SafeImage
              source={item.link}
              style={{ width: GALLERY_WIDTH, height: 320 }}
              className="bg-slate-100"
              resizeMode="cover"
              fallbackIcon="image"
              fallbackIconSize={32}
            />
          );
        }}
      />
      <View className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded-full">
        <MaterialCommunityIcons name="layers-outline" size={16} color="white" />
      </View>
    </View>
  );
};

const NetworkingPostCard = ({ post }: NetworkingPostCardProps) => {
  const { width } = useWindowDimensions();
  const { locationName } = useLocationName(post.position);
  const hostName =
    `${post.hoster?.firstname ?? ""} ${post.hoster?.lastname ?? ""}`.trim();
  const hostUserName = post.hoster?.uniqueName
    ? `@${post.hoster.uniqueName}`
    : "";
  const timeAgo = post.datePost ? dayjs(post.datePost).fromNow() : "Recently";
  const reaction = post.reaction?.trim();

  // Parsing Htags properly adding # if missing
  const tags = post.Htags?.map((t) => (t.startsWith("#") ? t : `#${t}`)) || [];

  const comments = post.comments ?? [];
  const commentsPreview = comments.slice(0, 2); // Show max 2 to keep layout tight

  return (
    <View
      className="mb-6 bg-white overflow-hidden"
      style={{ borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}
    >
      {/* Header section */}
      <View className="flex-row items-center justify-between px-4 pb-3 pt-4">
        <View className="flex-1 flex-row items-center">
          <SafeImage
            source={post.hoster?.imageProfile ?? ""}
            className="h-11 w-11 rounded-full border border-slate-100"
            fallbackIcon="person"
            fallbackIconSize={20}
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-[15px] font-poppins-bold text-slate-900 mr-1.5">
                {hostName || "Traveler"}
              </Text>
              {["admin", "verified"].includes(hostUserName) && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={14}
                  color="#3B82F6"
                />
              )}
            </View>
            <View className="flex-row items-center">
              <Text className="text-[12px] font-poppins-medium text-slate-500">
                {hostUserName || "@traveler"}
              </Text>
              <Text className="text-[12px] font-poppins-medium text-slate-400">
                {" "}
                • {timeAgo}
              </Text>
            </View>
          </View>
        </View>
        <Pressable className="h-8 w-8 items-center justify-center -mr-2">
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color="#64748B"
          />
        </Pressable>
      </View>

      {/* Optional Location */}
      {locationName && (
        <View className="mb-2.5 flex-row items-center px-4">
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={14}
            color="#059669"
          />
          <Text
            className="ml-1 text-[12px] font-poppins-semibold text-emerald-700"
            numberOfLines={1}
          >
            {locationName}
          </Text>
        </View>
      )}

      {/* Text Content (HTML parsed) */}
      {post.description && (
        <View className="px-4 pb-3">
          <RenderHtml
            contentWidth={width - 32}
            source={{ html: post.description }}
            tagsStyles={{
              p: {
                color: "#334155",
                fontSize: 14,
                lineHeight: 22,
                fontFamily: "AppRegular",
                margin: 0,
                padding: 0,
              },
              strong: { fontFamily: "AppBold", color: "#0F172A" },
              u: { textDecorationLine: "underline" },
              em: { fontStyle: "italic", fontFamily: "AppMedium" },
              h1: { fontSize: 18, fontFamily: "AppBold", margin: 0 },
              h2: {
                fontSize: 16,
                fontFamily: "AppBold",
                margin: 0,
                marginBottom: 4,
              },
              ul: { margin: 0, paddingLeft: 16 },
              li: {
                color: "#334155",
                fontSize: 14,
                fontFamily: "AppRegular",
                marginBottom: 2,
              },
            }}
          />
          {tags.length > 0 && (
            <Text className="mt-2 text-[14px] font-poppins-medium text-blue-600 leading-5">
              {tags.join(" ")}
            </Text>
          )}
        </View>
      )}

      {/* Dynamic Media layout */}
      <MediaGallery media={post.media || []} format={post.format || "single"} />

      {/* Action Bar */}
      <View className="flex-row items-center justify-between px-2 pt-3 pb-2">
        <View className="flex-row items-center">
          <Pressable className="flex-row items-center px-2 py-1.5 active:opacity-60">
            {reaction === "wow" || (post.nbLikes ?? 0) > 0 ? (
              <MaterialCommunityIcons name="heart" size={26} color="#EF4444" />
            ) : (
              <MaterialCommunityIcons
                name="heart-outline"
                size={26}
                color="#334155"
              />
            )}
            <Text
              className={`ml-1.5 text-[14px] font-poppins-bold ${(post.nbLikes ?? 0) > 0 ? "text-red-500" : "text-slate-600"}`}
            >
              {post.nbLikes ?? 0}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center px-2 py-1.5 ml-1 active:opacity-60">
            <MaterialCommunityIcons
              name="comment-outline"
              size={24}
              color="#334155"
            />
            <Text className="ml-1.5 text-[14px] font-poppins-bold text-slate-600">
              {post.nbComment ?? comments.length}
            </Text>
          </Pressable>
        </View>
        <View className="flex-row items-center">
          {reaction ? (
            <View className="bg-slate-100 rounded-full px-2.5 py-1 mr-3 flex-row items-center">
              <Text className="text-[16px]">{reaction}</Text>
            </View>
          ) : null}
          <Pressable className="px-2 py-1.5 active:opacity-60">
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={22}
              color="#334155"
            />
          </Pressable>
        </View>
      </View>

      {/* Comments Preview */}
      {commentsPreview.length > 0 && (
        <View className="px-4 pb-4">
          {commentsPreview.map((comment) => {
            const firstName = comment.userId?.firstName ?? "User";
            const lastName = comment.userId?.lastName ?? "";
            const userName = `${firstName} ${lastName}`.trim();
            const isReply = !!comment.replyTo;

            return (
              <View
                key={comment._id}
                className={`mt-2.5 flex-row items-start ${isReply ? "ml-6" : ""}`}
              >
                {isReply && (
                  <View className="mr-1.5 mt-0.5 opacity-60">
                    <MaterialCommunityIcons
                      name="arrow-bottom-right"
                      size={14}
                      color="#64748B"
                    />
                  </View>
                )}
                <Text className="text-[13px] leading-5 text-slate-800 font-poppins-medium flex-1">
                  <Text className="font-poppins-bold text-slate-900">
                    {userName}
                  </Text>{" "}
                  {comment.message}
                </Text>
              </View>
            );
          })}

          {comments.length > commentsPreview.length && (
            <Text className="mt-2 text-[13px] font-poppins-medium text-slate-500">
              View all {post.nbComment ?? comments.length} comments
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default memo(NetworkingPostCard);

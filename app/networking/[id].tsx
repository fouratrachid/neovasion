import React, { useRef, useState, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
  useWindowDimensions,
  ScrollView,
  Share,
} from "react-native";
import { Video } from "expo-av";
import RenderHtml from "react-native-render-html";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { SafeImage } from "@/components/SafeImage";
import { useLocationName } from "@/hooks/useLocationName";
import {
  NetworkingPost,
  NetworkingMedia,
  NetworkingComment,
} from "@/components/networking/types";

dayjs.extend(relativeTime);

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type NetworkingDetailScreenProps = {};

// --- Dynamic Media Gallery Component ---
const MediaGallery = memo(({ media }: { media: NetworkingMedia[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<Record<number, Video | null>>({});

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|webm|mov|m3u8)$/i.test(url) || url.includes("youtu");
  };

  if (!media || media.length === 0) return null;

  return (
    <View className="bg-black">
      {/* Main Gallery */}
      <FlatList
        data={media}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item, index }) => {
          const isVideo =
            item.type?.toLowerCase() === "video" || isVideoUrl(item.link);

          if (isVideo) {
            return (
              <View
                style={{ width: SCREEN_WIDTH, height: 450 }}
                className="bg-slate-900 items-center justify-center"
              >
                <Video
                  ref={(ref) => {
                    videoRefs.current[index] = ref;
                  }}
                  source={{ uri: item.link }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay={activeIndex === index}
                  isLooping
                  useNativeControls
                  style={{ width: SCREEN_WIDTH, height: 450 }}
                  onLoadStart={() => {
                    setVideoLoading((prev) => ({ ...prev, [index]: true }));
                  }}
                  onLoad={() => {
                    setVideoLoading((prev) => ({ ...prev, [index]: false }));
                  }}
                  onError={(error) => {
                    console.error(`Video load error at index ${index}:`, error);
                    setVideoLoading((prev) => ({ ...prev, [index]: false }));
                  }}
                />
                {videoLoading[index] && (
                  <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <View className="bg-white/20 p-3 rounded-full">
                      <MaterialCommunityIcons
                        name="loading"
                        size={32}
                        color="white"
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          }

          return (
            <SafeImage
              source={item.link}
              style={{ width: SCREEN_WIDTH, height: 450 }}
              className="bg-slate-900"
              resizeMode="cover"
              fallbackIcon="image"
              fallbackIconSize={48}
            />
          );
        }}
      />

      {/* Pagination Dots */}
      {media.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center gap-1.5">
          {media.map((_, i) => (
            <View
              key={i}
              className={`rounded-full transition-all ${
                activeIndex === i
                  ? "bg-white h-2 w-6"
                  : "bg-white/50 h-1.5 w-1.5"
              }`}
            />
          ))}
        </View>
      )}

      {/* Media Count */}
      {media.length > 1 && (
        <View className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full">
          <Text className="text-white text-[12px] font-poppins-bold">
            {activeIndex + 1} / {media.length}
          </Text>
        </View>
      )}
    </View>
  );
});
MediaGallery.displayName = "MediaGallery";

// --- Hoster Profile Section ---
const HosterSection = memo(
  ({
    hoster,
    post,
  }: {
    hoster: NetworkingPost["hoster"];
    post: NetworkingPost;
  }) => {
    const hostName =
      `${hoster.firstname ?? ""} ${hoster.lastname ?? ""}`.trim();
    const hostUserName = hoster.uniqueName
      ? `@${hoster.uniqueName}`
      : "@traveler";
    const timeAgo = post.datePost ? dayjs(post.datePost).fromNow() : "Recently";
    const { locationName, isLoading } = useLocationName(post.position);

    return (
      <View className="px-4 py-4 bg-white border-b border-slate-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <SafeImage
              source={hoster.imageProfile ?? ""}
              className="h-14 w-14 rounded-full border border-slate-100"
              fallbackIcon="person"
              fallbackIconSize={24}
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="text-[16px] font-poppins-bold text-slate-900">
                  {hostName || "Traveler"}
                </Text>
              </View>
              <Text className="text-[13px] font-poppins-medium text-slate-500">
                {hostUserName} • {timeAgo}
              </Text>
            </View>
          </View>
          <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <MaterialCommunityIcons
              name="dots-vertical"
              size={18}
              color="#64748B"
            />
          </Pressable>
        </View>

        {/* Location Badge */}
        {locationName && (
          <View className="mt-3 flex-row items-center bg-emerald-50 rounded-lg px-3 py-2.5">
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={16}
              color="#059669"
            />
            <Text className="ml-2 text-[13px] font-poppins-semibold text-emerald-700 flex-1">
              {isLoading ? "Loading location..." : locationName}
            </Text>
            <MaterialCommunityIcons
              name="navigation"
              size={14}
              color="#059669"
            />
          </View>
        )}
      </View>
    );
  },
);
HosterSection.displayName = "HosterSection";

// --- Description Section ---
const DescriptionSection = memo(({ post }: { post: NetworkingPost }) => {
  const { width } = useWindowDimensions();

  const htmlContent = useMemo(
    () =>
      post.description
        ? `<div style="font-family: 'Poppins'; color: #0F172A; font-size: 15px; line-height: 1.6;">${post.description}</div>`
        : "",
    [post.description],
  );

  const tagsStyles = useMemo(
    () => ({
      p: { marginVertical: 0 },
      br: { marginVertical: 4 },
      strong: { fontWeight: "bold" },
      em: { fontStyle: "italic" },
      u: { textDecorationLine: "underline" },
    }),
    [],
  );

  return (
    <View className="px-4 py-4 bg-white border-b border-slate-100">
      {/* Reaction Emoji */}
      {post.reaction && (
        <View className="mb-3 flex-row items-center">
          <Text className="text-[28px] mr-2">{post.reaction}</Text>
          <Text className="text-[12px] font-poppins-medium text-slate-600">
            {post.reaction} reaction from {post.hoster?.firstname}
          </Text>
        </View>
      )}

      {/* Description */}
      {htmlContent && (
        <View className="mb-3">
          <RenderHtml
            contentWidth={width - 32}
            source={{ html: htmlContent }}
            baseStyle={{ color: "#0F172A" }}
            tagsStyles={tagsStyles}
          />
        </View>
      )}

      {/* Hashtags */}
      {post.Htags && post.Htags.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {post.Htags.map((tag, idx) => (
            <Pressable
              key={idx}
              className="bg-blue-50 px-3 py-1.5 rounded-full active:bg-blue-100"
            >
              <Text className="text-[12px] font-poppins-semibold text-blue-600">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
});
DescriptionSection.displayName = "DescriptionSection";

// --- Engagement Stats Section ---
const EngagementStatsSection = memo(({ post }: { post: NetworkingPost }) => {
  return (
    <View className="px-4 py-3 bg-slate-50 flex-row justify-around">
      <View className="items-center">
        <MaterialCommunityIcons name="heart" size={20} color="#EF4444" />
        <Text className="text-[13px] font-poppins-bold text-slate-900 mt-1">
          {post.nbLikes ?? 0}
        </Text>
        <Text className="text-[11px] font-poppins-medium text-slate-600">
          Likes
        </Text>
      </View>

      <View className="items-center">
        <MaterialCommunityIcons
          name="comment-outline"
          size={20}
          color="#3B82F6"
        />
        <Text className="text-[13px] font-poppins-bold text-slate-900 mt-1">
          {post.nbComment ?? 0}
        </Text>
        <Text className="text-[11px] font-poppins-medium text-slate-600">
          Comments
        </Text>
      </View>

      <View className="items-center">
        <MaterialCommunityIcons
          name="share-outline"
          size={20}
          color="#8B5CF6"
        />
        <Text className="text-[13px] font-poppins-bold text-slate-900 mt-1">
          0
        </Text>
        <Text className="text-[11px] font-poppins-medium text-slate-600">
          Shares
        </Text>
      </View>
    </View>
  );
});
EngagementStatsSection.displayName = "EngagementStatsSection";

// --- Actions Row ---
const ActionsRow = memo(({ post }: { post: NetworkingPost }) => {
  const [isLiked, setIsLiked] = useState(post.is_like ?? false);
  const [likeCount, setLikeCount] = useState(post.nbLikes ?? 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing travel moment from ${post.hoster?.firstname} in Djerba!`,
        title: "Share Travel Memory",
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <View className="px-4 py-3 bg-white border-b border-slate-100 flex-row gap-4">
      <Pressable
        onPress={handleLike}
        className="flex-1 flex-row items-center justify-center gap-2 bg-red-50 py-2.5 rounded-lg active:bg-red-100"
      >
        <MaterialCommunityIcons
          name={isLiked ? "heart" : "heart-outline"}
          size={18}
          color={isLiked ? "#EF4444" : "#64748B"}
        />
        <Text
          className={`text-[13px] font-poppins-bold ${
            isLiked ? "text-red-600" : "text-slate-700"
          }`}
        >
          Like
        </Text>
      </Pressable>

      <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-blue-50 py-2.5 rounded-lg active:bg-blue-100">
        <MaterialCommunityIcons
          name="comment-outline"
          size={18}
          color="#3B82F6"
        />
        <Text className="text-[13px] font-poppins-bold text-blue-600">
          Comment
        </Text>
      </Pressable>

      <Pressable
        onPress={handleShare}
        className="flex-1 flex-row items-center justify-center gap-2 bg-purple-50 py-2.5 rounded-lg active:bg-purple-100"
      >
        <MaterialCommunityIcons
          name="share-outline"
          size={18}
          color="#8B5CF6"
        />
        <Text className="text-[13px] font-poppins-bold text-purple-600">
          Share
        </Text>
      </Pressable>
    </View>
  );
});
ActionsRow.displayName = "ActionsRow";

// --- Comments Section ---
const CommentItem = memo(
  ({
    comment,
    allComments,
  }: {
    comment: NetworkingComment;
    allComments: NetworkingComment[];
  }) => {
    const userName = `${comment.userId?.firstName ?? ""} ${
      comment.userId?.lastName ?? ""
    }`.trim();
    const timeAgo = comment.dateTime
      ? dayjs(comment.dateTime).fromNow()
      : "Recently";

    // Find parent comment if this is a reply
    const parentComment = comment.replyTo
      ? allComments.find((c) => c._id === comment.replyTo)
      : null;
    const parentUserName = parentComment
      ? `${parentComment.userId?.firstName ?? ""} ${
          parentComment.userId?.lastName ?? ""
        }`.trim()
      : null;

    const isReply = !!comment.replyTo;

    return (
      <View
        className={`px-4 py-3 border-b border-slate-100 ${
          isReply ? "ml-8 bg-blue-50/30" : ""
        }`}
      >
        {/* Reply indicator */}
        {isReply && parentUserName && (
          <View className="mb-2 flex-row items-center gap-1.5 pb-2 border-l-2 border-blue-400 pl-3">
            <MaterialCommunityIcons name="reply" size={12} color="#3B82F6" />
            <Text className="text-[11px] font-poppins-medium text-blue-600">
              Replying to {parentUserName}
            </Text>
          </View>
        )}

        <View className="flex-row">
          {comment.userId?.imageLink ? (
            <SafeImage
              source={comment.userId.imageLink}
              className="h-8 w-8 rounded-full border border-slate-200 mr-3 flex-shrink-0"
              fallbackIcon="person"
              fallbackIconSize={14}
            />
          ) : (
            <View className="h-8 w-8 rounded-full bg-black items-center justify-center mr-3 flex-shrink-0">
              <Text className="text-white text-[11px] font-poppins-bold">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-[13px] font-poppins-bold text-slate-900">
                {userName || "Traveler"}
              </Text>
              <Text className="text-[11px] font-poppins-medium text-slate-500">
                {timeAgo}
              </Text>
            </View>
            <Text className="text-[13px] font-poppins-medium text-slate-700 leading-5">
              {comment.message}
            </Text>
            {/* <Pressable className="mt-2 flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="heart-outline"
                size={14}
                color="#94A3B8"
              />
              <Text className="text-[11px] font-poppins-medium text-slate-500">
                Like
              </Text>
            </Pressable> */}
          </View>
        </View>
      </View>
    );
  },
);
CommentItem.displayName = "CommentItem";

const CommentsSection = memo(({ post }: { post: NetworkingPost }) => {
  const comments = post.comments ?? [];

  if (comments.length === 0) {
    return (
      <View className="px-4 py-6 items-center justify-center bg-slate-50">
        <MaterialCommunityIcons
          name="comment-question-outline"
          size={32}
          color="#CBD5E1"
        />
        <Text className="mt-2 text-[14px] font-poppins-bold text-slate-600">
          No comments yet
        </Text>
        <Text className="mt-1 text-[12px] font-poppins-medium text-slate-500">
          Be the first to share your thoughts
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white">
      <View className="px-4 py-3 border-b border-slate-100">
        <Text className="text-[15px] font-poppins-bold text-slate-900">
          Comments ({comments.length})
        </Text>
      </View>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          allComments={comments}
        />
      ))}
    </View>
  );
});
CommentsSection.displayName = "CommentsSection";

// --- Comment Input Section ---
const CommentInputSection = memo(() => {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#F8FAFC"]}
      className="px-4 py-3 border-t border-slate-100 flex-row items-center gap-3"
    >
      <View className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
      <Pressable className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 flex-row items-center justify-between">
        <Text className="text-[13px] text-slate-500 font-poppins-medium">
          Write a comment...
        </Text>
        <MaterialCommunityIcons
          name="emoticon-outline"
          size={16}
          color="#94A3B8"
        />
      </Pressable>
      <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-blue-500">
        <MaterialCommunityIcons name="send" size={16} color="white" />
      </Pressable>
    </LinearGradient>
  );
});
CommentInputSection.displayName = "CommentInputSection";

export default function NetworkingDetailScreen() {
  const { id, post: postParam } = useLocalSearchParams<{
    id: string;
    post?: string;
  }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // Parse post from route params
  let post: NetworkingPost | null = null;
  try {
    post = postParam ? JSON.parse(postParam) : null;
  } catch (error) {
    console.error("Failed to parse post:", error);
  }

  const handleBackPress = () => {
    router.back();
  };

  // If no post is available, show error state
  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 z-50 flex-row items-center justify-between px-4 py-3 bg-white/80 border-b border-slate-200">
          <Pressable
            onPress={handleBackPress}
            className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:opacity-75"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color="#0F172A"
            />
          </Pressable>
          <View className="flex-1" />
          <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:opacity-75">
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={20}
              color="#0F172A"
            />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#DC2626"
          />
          <Text className="mt-4 text-[18px] font-poppins-bold text-slate-900 text-center">
            Unable to Load Post
          </Text>
          <Text className="mt-2 text-[14px] font-poppins-medium text-slate-600 text-center">
            The post data is missing or invalid.
          </Text>
          <Pressable
            onPress={handleBackPress}
            className="mt-6 bg-blue-600 px-6 py-3 rounded-lg active:bg-blue-700"
          >
            <Text className="text-white font-poppins-bold text-[14px]">
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-50 flex-row items-center justify-between px-4 py-3 bg-white/80">
          <Pressable
            onPress={handleBackPress}
            className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:opacity-75"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color="#0F172A"
            />
          </Pressable>

          <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:opacity-75">
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={20}
              color="#0F172A"
            />
          </Pressable>
        </View>
        {/* Top Spacing for Header */}
        <View className="h-16" />
        {/* Media Gallery */}
        <MediaGallery media={post.media} />
        {/* Hoster Section */}
        <HosterSection hoster={post.hoster} post={post} />
        {/* Description */}
        <DescriptionSection post={post} />
        {/* Actions Row */}
        <ActionsRow post={post} />
        {/* Engagement Stats */}
        <EngagementStatsSection post={post} />
        {/* Comments Section */}
        <CommentsSection post={post} />
        {/* Bottom Spacing */}
        <View className="h-4" />
      </ScrollView>

      {/* Comment Input */}
      <CommentInputSection />
    </SafeAreaView>
  );
}

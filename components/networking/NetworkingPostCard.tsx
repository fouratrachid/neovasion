import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useMemo } from "react";
import { Text, View } from "react-native";

import { SafeImage } from "@/components/SafeImage";
import { NetworkingPost } from "./types";

type NetworkingPostCardProps = {
  post: NetworkingPost;
};

const toPlainText = (html?: string): string => {
  if (!html) {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatPostDate = (iso?: string): string => {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString();
};

const getInitials = (first?: string, last?: string): string => {
  const firstLetter = first?.trim()?.charAt(0)?.toUpperCase() ?? "";
  const lastLetter = last?.trim()?.charAt(0)?.toUpperCase() ?? "";
  return `${firstLetter}${lastLetter}` || "U";
};

const NetworkingPostCard = ({ post }: NetworkingPostCardProps) => {
  const hostName =
    `${post.hoster?.firstname ?? ""} ${post.hoster?.lastname ?? ""}`.trim();
  const firstMedia = post.media?.[0];
  const plainDescription = useMemo(
    () => toPlainText(post.description),
    [post.description],
  );
  const dateLabel = formatPostDate(post.datePost);
  const reaction = post.reaction?.trim();
  const hostUserName = post.hoster?.uniqueName
    ? `@${post.hoster.uniqueName}`
    : "";
  const isVideo = firstMedia?.type?.toLowerCase() === "video";
  const comments = post.comments ?? [];
  const commentsPreview = comments.slice(0, 3);

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <View className="flex-row items-center justify-between px-4 pb-3 pt-4">
        <View className="flex-1 flex-row items-center">
          <SafeImage
            source={post.hoster?.imageProfile ?? ""}
            className="h-11 w-11 rounded-full"
            fallbackIcon="person"
            fallbackIconSize={20}
          />
          <View className="ml-3 flex-1">
            <Text className="text-[16px] font-poppins-bold text-slate-900">
              {hostName || "Traveler"}
            </Text>
            <Text
              className="text-[12px] font-poppins-medium text-slate-500"
              numberOfLines={1}
            >
              {hostUserName || "@traveler"} • {dateLabel || "Recently"}
            </Text>
          </View>
        </View>
        {reaction ? <Text className="text-lg">{reaction}</Text> : null}
      </View>

      {plainDescription ? (
        <Text className="px-4 pb-3 text-[14px] leading-6 font-poppins-medium text-slate-700">
          {plainDescription}
        </Text>
      ) : null}

      {post.position ? (
        <View className="mb-3 flex-row items-center px-4">
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color="#64748B"
          />
          <Text
            className="ml-1 flex-1 text-[13px] font-poppins-medium text-slate-500"
            numberOfLines={1}
          >
            {post.position}
          </Text>
        </View>
      ) : null}

      <SafeImage
        source={firstMedia?.link ?? ""}
        className="h-56 w-full"
        resizeMode="cover"
        fallbackIcon={isVideo ? "videocam" : "image"}
        fallbackIconSize={28}
      />

      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-[13px] font-poppins-medium text-slate-600">
          {post.nbLikes ?? 0} likes
        </Text>
        <Text className="text-[13px] font-poppins-medium text-slate-600">
          {post.nbComment ?? comments.length} comments
        </Text>
      </View>

      <View className="mx-4 h-px bg-slate-200" />

      <View className="flex-row items-center justify-between px-4 py-2">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="thumb-up-outline"
            size={18}
            color="#475569"
          />
          <Text className="ml-1 text-[13px] font-poppins-semibold text-slate-600">
            Like
          </Text>
        </View>

        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="comment-outline"
            size={18}
            color="#475569"
          />
          <Text className="ml-1 text-[13px] font-poppins-semibold text-slate-600">
            Comment
          </Text>
        </View>

        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="share-outline"
            size={18}
            color="#475569"
          />
          <Text className="ml-1 text-[13px] font-poppins-semibold text-slate-600">
            Share
          </Text>
        </View>
      </View>

      {commentsPreview.length > 0 ? (
        <View className="border-t border-slate-200 px-4 pb-4 pt-3">
          {commentsPreview.map((comment) => {
            const firstName = comment.userId?.firstName ?? "User";
            const lastName =
              comment.userId?.lastName ?? comment.userId?.lastname ?? "";
            const userName = `${firstName} ${lastName}`.trim();

            return (
              <View key={comment._id} className="mb-2 flex-row items-start">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-[12px] font-poppins-bold text-blue-700">
                    {getInitials(firstName, lastName)}
                  </Text>
                </View>

                <View className="ml-2 flex-1 rounded-2xl bg-slate-100 px-3 py-2">
                  <Text className="text-[12px] font-poppins-bold text-slate-800">
                    {userName}
                  </Text>
                  <Text className="mt-0.5 text-[13px] font-poppins-medium text-slate-700">
                    {comment.message}
                  </Text>
                </View>
              </View>
            );
          })}

          {comments.length > commentsPreview.length ? (
            <Text className="mt-1 text-[12px] font-poppins-semibold text-blue-700">
              View {comments.length - commentsPreview.length} more comments
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default memo(NetworkingPostCard);

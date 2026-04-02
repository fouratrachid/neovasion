import React, { memo } from "react";
import { Text, View, Pressable, Dimensions, FlatList, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { SafeImage } from "@/components/SafeImage";
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

// --- Dynamic Media Gallery Component ---
const MediaGallery = ({ media, format }: { media: NetworkingMedia[], format: string }) => {
  const { width } = useWindowDimensions();
  const GALLERY_WIDTH = width; // Taking full width

  if (!media || media.length === 0) return null;

  // Single Image
  if (media.length === 1 || format === "single") {
    return (
       <SafeImage
          source={media[0].link}
          style={{ width: GALLERY_WIDTH, height: 320 }}
          className="bg-slate-100"
          fallbackIcon={media[0].type?.toLowerCase() === "video" ? "videocam" : "image"}
          fallbackIconSize={32}
          resizeMode="cover"
       />
    );
  }

  // Left Large Right Two
  if (format === "left-large-right-two" && media.length >= 3) {
    return (
      <View style={{ width: GALLERY_WIDTH, height: 340, flexDirection: 'row', gap: 2 }}>
        <View style={{ flex: 2 }}>
          <SafeImage source={media[0].link} className="w-full h-full bg-slate-100" resizeMode="cover" />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <SafeImage source={media[1].link} className="w-full flex-1 bg-slate-100" resizeMode="cover" />
          <SafeImage source={media[2].link} className="w-full flex-1 bg-slate-100" resizeMode="cover" />
        </View>
      </View>
    );
  }

  // Grid 2x2
  if (format === "grid-2x2" && media.length >= 4) {
    return (
      <View style={{ width: GALLERY_WIDTH, height: 340, flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
        {media.slice(0, 4).map((m, i) => (
          <View key={i} style={{ width: GALLERY_WIDTH / 2 - 1, height: 169 }}>
             <SafeImage source={m.link} className="w-full h-full bg-slate-100" resizeMode="cover" />
          </View>
        ))}
      </View>
    );
  }

  // Fallback to Carousel
  return (
    <View style={{ width: GALLERY_WIDTH, height: 320 }}>
      <FlatList
        data={media}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <SafeImage
            source={item.link}
            style={{ width: GALLERY_WIDTH, height: 320 }}
            className="bg-slate-100"
            resizeMode="cover"
            fallbackIcon={item.type?.toLowerCase() === "video" ? "videocam" : "image"}
            fallbackIconSize={32}
         />
        )}
      />
      <View className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded-full">
         <MaterialCommunityIcons name="layers-outline" size={16} color="white" />
      </View>
    </View>
  );
};


const NetworkingPostCard = ({ post }: NetworkingPostCardProps) => {
  const { width } = useWindowDimensions();
  const hostName = `${post.hoster?.firstname ?? ""} ${post.hoster?.lastname ?? ""}`.trim();
  const hostUserName = post.hoster?.uniqueName ? `@${post.hoster.uniqueName}` : "";
  const timeAgo = post.datePost ? dayjs(post.datePost).fromNow() : "Recently";
  const reaction = post.reaction?.trim();

  // Parsing Htags properly adding # if missing
  const tags = post.Htags?.map(t => t.startsWith('#') ? t : `#${t}`) || [];
  
  const comments = post.comments ?? [];
  const commentsPreview = comments.slice(0, 2); // Show max 2 to keep layout tight

  return (
    <View className="mb-6 bg-white overflow-hidden" style={{ borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
      
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
              <Text className="text-[15px] font-poppins-bold text-slate-900 mr-1.5">{hostName || "Traveler"}</Text>
              {['admin', 'verified'].includes(hostUserName) && (
                 <MaterialCommunityIcons name="check-decagram" size={14} color="#3B82F6" />
              )}
            </View>
            <View className="flex-row items-center">
              <Text className="text-[12px] font-poppins-medium text-slate-500">{hostUserName || "@traveler"}</Text>
              <Text className="text-[12px] font-poppins-medium text-slate-400"> • {timeAgo}</Text>
            </View>
          </View>
        </View>
        <Pressable className="h-8 w-8 items-center justify-center -mr-2">
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#64748B" />
        </Pressable>
      </View>

      {/* Optional Location */}
      {post.position && (
        <View className="mb-2.5 flex-row items-center px-4">
          <MaterialCommunityIcons name="map-marker-radius" size={14} color="#059669" />
          <Text className="ml-1 text-[12px] font-poppins-semibold text-emerald-700" numberOfLines={1}>
            {post.position.split(',')[0]}
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
                  p: { color: '#334155', fontSize: 14, lineHeight: 22, fontFamily: 'AppRegular', margin: 0, padding: 0 },
                  strong: { fontFamily: 'AppBold', color: '#0F172A' },
                  u: { textDecorationLine: 'underline' },
                  em: { fontStyle: 'italic', fontFamily: 'AppMedium' },
                  h1: { fontSize: 18, fontFamily: 'AppBold', margin: 0 },
                  h2: { fontSize: 16, fontFamily: 'AppBold', margin: 0, marginBottom: 4 },
                  ul: { margin: 0, paddingLeft: 16 },
                  li: { color: '#334155', fontSize: 14, fontFamily: 'AppRegular', marginBottom: 2 }
              }}
           />
           {tags.length > 0 && (
             <Text className="mt-2 text-[14px] font-poppins-medium text-blue-600 leading-5">
               {tags.join(' ')}
             </Text>
           )}
        </View>
      )}

      {/* Dynamic Media layout */}
      <MediaGallery media={post.media || []} format={post.format || 'single'} />

      {/* Action Bar */}
      <View className="flex-row items-center justify-between px-2 pt-3 pb-2">
         <View className="flex-row items-center">
            <Pressable className="flex-row items-center px-2 py-1.5 active:opacity-60">
               {reaction === 'wow' || (post.nbLikes ?? 0) > 0 ? (
                 <MaterialCommunityIcons name="heart" size={26} color="#EF4444" />
               ) : (
                 <MaterialCommunityIcons name="heart-outline" size={26} color="#334155" />
               )}
               <Text className={`ml-1.5 text-[14px] font-poppins-bold ${(post.nbLikes ?? 0) > 0 ? 'text-red-500' : 'text-slate-600'}`}>
                 {post.nbLikes ?? 0}
               </Text>
            </Pressable>

            <Pressable className="flex-row items-center px-2 py-1.5 ml-1 active:opacity-60">
               <MaterialCommunityIcons name="comment-outline" size={24} color="#334155" />
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
               <MaterialCommunityIcons name="share-variant-outline" size={22} color="#334155" />
            </Pressable>
         </View>
      </View>

      {/* Comments Preview */}
      {commentsPreview.length > 0 && (
        <View className="px-4 pb-4">
          {commentsPreview.map((comment) => {
            const firstName = comment.userId?.firstName ?? "User";
            const lastName = comment.userId?.lastName ?? comment.userId?.lastname ?? "";
            const userName = `${firstName} ${lastName}`.trim();
            const isReply = !!comment.replyTo;

            return (
              <View key={comment._id} className={`mt-2.5 flex-row items-start ${isReply ? 'ml-6' : ''}`}>
                {isReply && (
                   <View className="mr-1.5 mt-0.5 opacity-60">
                      <MaterialCommunityIcons name="arrow-bottom-right" size={14} color="#64748B" />
                   </View>
                )}
                <Text className="text-[13px] leading-5 text-slate-800 font-poppins-medium flex-1">
                  <Text className="font-poppins-bold text-slate-900">{userName}</Text> {comment.message}
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

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageProps, View } from "react-native";

interface SafeImageProps extends Omit<ImageProps, "source"> {
  source: any; 
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackIconColor?: string;
  fallbackIconSize?: number;
  fallbackBackgroundColor?: string;
  containerStyle?: any;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  source,
  fallbackIcon = "person",
  fallbackIconColor = "#6B7280",
  fallbackIconSize = 24,
  fallbackBackgroundColor = "#F3F4F6",
  containerStyle,
  style,
  onError,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getImageUri = (src: any): string | null => {
    if (typeof src === "string") {
      return src.length > 0 ? src : null;
    }
    if (src && typeof src === "object") {
      if (src.uri && typeof src.uri === "string") {
        return src.uri;
      }
      if (src.url && typeof src.url === "string") {
        return src.url;
      }
    }
    return null;
  };

  const imageUri = getImageUri(source);
  const shouldShowFallback = !imageUri || imageError;

  const handleImageError = (error: any) => {
    console.log("❌ SafeImage load error:", error.nativeEvent?.error || error);
    setImageError(true);
    onError?.(error);
  };

  if (shouldShowFallback) {
    return (
      <View
        style={[
          {
            backgroundColor: fallbackBackgroundColor,
            justifyContent: "center",
            alignItems: "center",
          },
          containerStyle,
          style,
        ]}
      >
        <Ionicons
          name={fallbackIcon}
          size={fallbackIconSize}
          color={fallbackIconColor}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={style}
      onError={handleImageError}
      {...props}
    />
  );
};

import { colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { useAuthStore } from "@/store/authStore";
import { SafeImage } from "@/components/SafeImage";

interface ProfileDropDownProps {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { x: number; y: number };
  onPressBecomeHoster?: () => void;
}

const ProfileDropDown = memo(
  ({
    visible,
    onClose,
    anchorPosition = { x: 0, y: 50 },
    onPressBecomeHoster,
  }: ProfileDropDownProps) => {
    const { t } = useTranslation();
    const { data: profileResp } = useAuthProfile();
    const { logout } = useAuthStore();
    const user = profileResp?.data;

    const handleEditProfile = () => {
      onClose();
      router.push("/profile/edit");
    };

    const handleBecomeHoster = () => {
      onClose();
      onPressBecomeHoster?.();
    };

    const handleLogout = async () => {
      onClose();
      await logout();
    };

    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1"
          onPress={onClose}
          style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
        >
          {/* Dropdown Card */}
          <View
            className="absolute bg-white rounded-2xl overflow-hidden"
            style={{
              top: anchorPosition.y,
              right: 16,
              width: 280,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            {/* Header */}
            <View className="p-4 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center overflow-hidden">
                  {user?.imageLink ? (
                    <SafeImage
                      source={user.imageLink}
                      className="w-full h-full"
                      fallbackIcon="person"
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={20}
                      color={colors.primary[500]}
                    />
                  )}
                </View>
                <View className="flex-1 ml-3">
                  <Text
                    className="text-[15px] font-poppins-bold text-slate-900"
                    numberOfLines={1}
                  >
                    {user
                      ? `${user.firstName} ${user.lastName}`
                      : "Guest"}
                  </Text>
                  <Text
                    className="text-[12px] font-poppins-medium text-slate-500 mt-0.5"
                    numberOfLines={1}
                  >
                    {user?.email || ""}
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View className="py-1">
              {/* Profile */}
              <TouchableOpacity
                onPress={handleEditProfile}
                className="flex-row items-center px-4 py-3 active:bg-slate-50"
              >
                <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mr-3">
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color="#475569"
                  />
                </View>
                <Text className="flex-1 text-[14px] font-poppins-medium text-slate-800">
                  {t("common.account.profile") || "My Profile"}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="#CBD5E1"
                />
              </TouchableOpacity>

              {/* Become a Trip Hoster */}
              <TouchableOpacity
                onPress={handleBecomeHoster}
                className="flex-row items-center px-4 py-3 active:bg-slate-50"
              >
                <View className="w-8 h-8 rounded-full bg-amber-50 items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="airplane-takeoff"
                    size={16}
                    color="#D97706"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-poppins-medium text-slate-800">
                    Become a Trip Hoster
                  </Text>
                  <Text className="text-[11px] font-poppins-medium text-slate-400 mt-0.5">
                    Host & share your trips
                  </Text>
                </View>
                <View className="bg-amber-100 rounded-full px-2 py-0.5">
                  <Text className="text-[10px] font-poppins-bold text-amber-700">
                    NEW
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Separator */}
              <View className="h-px bg-slate-100 mx-4 my-1" />

              {/* Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center px-4 py-3 active:bg-red-50/50"
              >
                <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center mr-3">
                  <Ionicons
                    name="log-out-outline"
                    size={16}
                    color="#EF4444"
                  />
                </View>
                <Text className="flex-1 text-[14px] font-poppins-medium text-red-500">
                  {t("common.account.logout") || "Logout"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    );
  },
);

ProfileDropDown.displayName = "ProfileDropDown";

export default ProfileDropDown;

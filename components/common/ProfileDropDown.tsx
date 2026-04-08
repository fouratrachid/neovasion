import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Image,
} from "react-native";

interface ProfileDropDownProps {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { x: number; y: number };
}

const ProfileDropDown = memo(
  ({
    visible,
    onClose,
    anchorPosition = { x: 0, y: 50 },
  }: ProfileDropDownProps) => {
    const { t } = useTranslation();

    const handleEditProfile = () => {
      onClose();
      router.push("/profile/edit");
    };

    const handleLogout = async () => {
      onClose();
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
          style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        >
          {/* Dropdown Card */}
          <View
            className="absolute bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-neutral-100 dark:border-dark-700"
            style={{
              top: anchorPosition.y,
              right: 16,
              width: 300,
            }}
          >
            {/* Header Section (Account Screen Header Style) */}
            <View className="p-4 border-b border-neutral-50 dark:border-dark-700">
              <View className="flex-row items-center">
                {/* Avatar */}
                {/* <View className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center overflow-hidden">
                  {userImage ? (
                    <Image
                      source={{ uri: userImage }}
                      className="w-full h-full"
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={28}
                      color={colors.primary[500]}
                    />
                  )}
                </View> */}

                {/* User Details */}
                <View className="flex-1 ml-3">
                  <Text
                    className="text-lg font-bold text-neutral-900 dark:text-white"
                    numberOfLines={1}
                  >
                    user name
                  </Text>
                </View>

                {/* Edit Button (Account Screen Style) */}
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center"
                >
                  <Ionicons name="pencil" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Items */}
            <View className="py-2">
              {/* Profile Detail */}
              <TouchableOpacity
                onPress={handleEditProfile}
                className="flex-row items-center px-4 py-3 active:bg-neutral-50 dark:active:bg-dark-700"
              >
                <View className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-dark-700 items-center justify-center mr-3">
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={colors.neutral[600]}
                  />
                </View>
                <Text className="flex-1 text-sm font-medium text-neutral-900 dark:text-white">
                  {t("common.account.profile") || "Profile"}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.neutral[400]}
                />
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center px-4 py-3 active:bg-neutral-50 dark:active:bg-dark-700"
              >
                <View className="w-8 h-8 rounded-full bg-error-50 dark:bg-error-900/20 items-center justify-center mr-3">
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={colors.error[500]}
                  />
                </View>
                <Text className="flex-1 text-sm font-medium text-error-500">
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

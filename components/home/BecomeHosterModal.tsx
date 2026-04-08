import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useHosterRequest } from "@/hooks/useHosterRequest";
import { useHosterStatus } from "@/hooks/useHosterStatus";
import { SocialEntry } from "@/services/hosterService";

const { height } = Dimensions.get("window");

interface BecomeHosterModalProps {
  visible: boolean;
  onClose: () => void;
}

interface SocialFieldEntry {
  name: string;
  link: string;
  followers: string;
  isCustom?: boolean;
}

type SocialPlatform = SocialEntry["social"];

interface SocialConfig {
  key: SocialPlatform;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  placeholder: string;
}

const SOCIAL_PLATFORMS: SocialConfig[] = [
  {
    key: "instagram",
    label: "Instagram",
    icon: "logo-instagram",
    color: "#E1306C",
    bgColor: "#FDF2F8",
    placeholder: "@yourusername",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: "logo-tiktok",
    color: "#010101",
    bgColor: "#F3F4F6",
    placeholder: "@yourusername",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: "logo-youtube",
    color: "#FF0000",
    bgColor: "#FEF2F2",
    placeholder: "Channel name",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "logo-facebook",
    color: "#1877F2",
    bgColor: "#EFF6FF",
    placeholder: "Page / Profile name",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    icon: "logo-twitter",
    color: "#1DA1F2",
    bgColor: "#F0F9FF",
    placeholder: "@yourusername",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "logo-linkedin",
    color: "#0A66C2",
    bgColor: "#EFF6FF",
    placeholder: "Profile URL",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return { bg: "#ECFDF5", text: "#059669", icon: "checkmark-circle" };
    case "Rejected":
      return { bg: "#FEF2F2", text: "#DC2626", icon: "close-circle" };
    case "Pending":
    default:
      return { bg: "#FEF3C7", text: "#D97706", icon: "time-outline" };
  }
};

export default function BecomeHosterModal({
  visible,
  onClose,
}: BecomeHosterModalProps) {
  const { submitRequestAsync, isSubmitting, isSuccess, reset } =
    useHosterRequest();
  const {
    data: existingRequest,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useHosterStatus();

  // Form state
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [presetSocials, setPresetSocials] = useState<
    Record<string, { link: string; followers: string }>
  >({
    instagram: { link: "", followers: "" },
    tiktok: { link: "", followers: "" },
    youtube: { link: "", followers: "" },
    facebook: { link: "", followers: "" },
    twitter: { link: "", followers: "" },
    linkedin: { link: "", followers: "" },
  });
  const [customSocials, setCustomSocials] = useState<SocialFieldEntry[]>([]);
  const [expandedPreset, setExpandedPreset] = useState<string | null>(null);
  const [expandedCustomIdx, setExpandedCustomIdx] = useState<number | null>(
    null,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const stepTransition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (isSuccess) {
      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 6,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleClose = () => {
    // Reset everything
    setPhone("");
    setRole("");
    setPresetSocials({
      instagram: { link: "", followers: "" },
      tiktok: { link: "", followers: "" },
      youtube: { link: "", followers: "" },
      facebook: { link: "", followers: "" },
      twitter: { link: "", followers: "" },
      linkedin: { link: "", followers: "" },
    });
    setCustomSocials([]);
    setStep(1);
    setErrors({});
    setExpandedPreset(null);
    setExpandedCustomIdx(null);
    setShowNewRequestModal(false);
    reset();
    successScale.setValue(0);
    onClose();
  };

  const handleNewRequest = () => {
    setShowNewRequestModal(false);
    setPhone("");
    setRole("");
    setPresetSocials({
      instagram: { link: "", followers: "" },
      tiktok: { link: "", followers: "" },
      youtube: { link: "", followers: "" },
      facebook: { link: "", followers: "" },
      twitter: { link: "", followers: "" },
      linkedin: { link: "", followers: "" },
    });
    setCustomSocials([]);
    setStep(1);
    setErrors({});
    setExpandedPreset(null);
    setExpandedCustomIdx(null);
    reset();
    successScale.setValue(0);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{8,}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid phone number";
    if (!role.trim()) newErrors.role = "Please enter your role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep2 = () => {
    if (!validateStep1()) return;
    setStep(2);
    Animated.timing(stepTransition, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const goBackToStep1 = () => {
    setStep(1);
    Animated.timing(stepTransition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = async () => {
    // Collect filled preset socials
    const filledPresets: SocialEntry[] = SOCIAL_PLATFORMS.filter(
      (p) =>
        presetSocials[p.key].link.trim() &&
        presetSocials[p.key].followers.trim(),
    ).map((p) => ({
      social: p.key,
      sociallink: presetSocials[p.key].link.trim(),
      followers: parseInt(presetSocials[p.key].followers, 10) || 0,
    }));

    // Collect filled custom socials
    const filledCustom: SocialEntry[] = customSocials
      .filter((s) => s.link.trim() && s.followers.trim())
      .map((s) => ({
        social: s.name,
        sociallink: s.link.trim(),
        followers: parseInt(s.followers, 10) || 0,
      }));

    const allFilled = [...filledPresets, ...filledCustom];

    if (allFilled.length === 0) {
      setErrors({ socials: "Add at least one social media account" });
      return;
    }

    setErrors({});

    try {
      await submitRequestAsync({
        phone: phone.trim(),
        role: role.trim(),
        socials: allFilled,
      });
    } catch (err: any) {
      setErrors({ submit: err.message || "Something went wrong" });
    }
  };

  const addCustomPlatform = () => {
    const newSocial: SocialFieldEntry = {
      name: "",
      link: "",
      followers: "",
      isCustom: true,
    };
    setCustomSocials([...customSocials, newSocial]);
  };

  const updatePresetSocial = (
    platformKey: string,
    field: "link" | "followers",
    value: string,
  ) => {
    setPresetSocials((prev) => ({
      ...prev,
      [platformKey]: { ...prev[platformKey], [field]: value },
    }));
  };

  const updateCustomSocial = (
    idx: number,
    field: "name" | "link" | "followers",
    value: string,
  ) => {
    const updated = [...customSocials];
    updated[idx] = { ...updated[idx], [field]: value };
    setCustomSocials(updated);
  };

  const removeCustomSocial = (idx: number) => {
    setCustomSocials(customSocials.filter((_, i) => i !== idx));
    if (expandedCustomIdx === idx) setExpandedCustomIdx(null);
  };

  const getPlatformConfig = (name: string): SocialConfig | undefined => {
    return SOCIAL_PLATFORMS.find((p) => p.key === name) as any;
  };

  const filledSocialsCount =
    Object.values(presetSocials).filter(
      (s) => s.link.trim() && s.followers.trim(),
    ).length +
    customSocials.filter((s) => s.link.trim() && s.followers.trim()).length;

  // === LOADING STATUS ===
  if (isLoadingStatus && visible) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <Animated.View
          style={{ flex: 1, opacity: fadeAnim }}
          className="bg-black/60"
        >
          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white rounded-t-[32px] mt-12 items-center justify-center"
          >
            <ActivityIndicator size="large" color="#0A2B72" />
            <Text className="mt-3 text-slate-500 font-poppins-medium">
              Loading...
            </Text>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }

  // === EXISTING REQUEST VIEW ===
  if (existingRequest && !showNewRequestModal) {
    const statusColor = getStatusColor(existingRequest.status);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <Animated.View
          style={{ flex: 1, opacity: fadeAnim }}
          className="bg-black/60"
        >
          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-slate-50 rounded-t-[32px] mt-12"
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              {/* Header */}
              <View className="px-5 pt-5 pb-3 border-b border-slate-100">
                <View className="w-10 h-1.5 bg-slate-300 rounded-full self-center mb-5" />
                <View className="flex-row items-center justify-between">
                  <Text className="text-[22px] font-poppins-bold text-slate-900">
                    Your Request
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    className="w-9 h-9 rounded-full bg-white items-center justify-center border border-slate-200"
                  >
                    <Ionicons name="close" size={18} color="#64748B" />
                  </Pressable>
                </View>
              </View>

              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="px-5 pt-6 pb-4">
                  {/* Status Banner */}
                  <View
                    className="rounded-2xl px-5 py-4 flex-row items-center mb-6"
                    style={{ backgroundColor: statusColor.bg }}
                  >
                    <Ionicons
                      name={statusColor.icon as any}
                      size={24}
                      color={statusColor.text}
                    />
                    <View className="flex-1 ml-3">
                      <Text
                        className="text-[16px] font-poppins-bold"
                        style={{ color: statusColor.text }}
                      >
                        {existingRequest.status}
                      </Text>
                      <Text
                        className="text-[12px] font-poppins-medium mt-1"
                        style={{ color: statusColor.text, opacity: 0.8 }}
                      >
                        Submitted on{" "}
                        {new Date(
                          existingRequest.createdAt,
                        ).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* Rejection Reason */}
                  {existingRequest.motifRefus && (
                    <View className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 mb-6">
                      <Text className="text-[12px] font-poppins-semibold text-red-700 uppercase tracking-wide mb-2">
                        Rejection Reason
                      </Text>
                      <Text className="text-[14px] font-poppins-medium text-red-900">
                        {existingRequest.motifRefus}
                      </Text>
                    </View>
                  )}

                  {/* Request Details Card */}
                  <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
                    {/* Phone */}
                    <View className="px-5 py-4">
                      <Text className="text-[11px] font-poppins-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Phone
                      </Text>
                      <Text className="text-[15px] font-poppins-bold text-slate-900">
                        {existingRequest.phone}
                      </Text>
                    </View>

                    <View className="h-px bg-slate-100" />

                    {/* Role */}
                    <View className="px-5 py-4">
                      <Text className="text-[11px] font-poppins-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Role
                      </Text>
                      <Text className="text-[15px] font-poppins-bold text-slate-900 capitalize">
                        {existingRequest.role}
                      </Text>
                    </View>
                  </View>

                  {/* Social Media Accounts */}
                  {existingRequest.socials.length > 0 && (
                    <View>
                      <Text className="text-[13px] font-poppins-semibold text-slate-700 mb-3 ml-1">
                        Social Media Accounts
                      </Text>
                      {existingRequest.socials.map((social, idx) => {
                        const platformConfig = getPlatformConfig(social.social);

                        return (
                          <View
                            key={idx}
                            className="bg-white rounded-2xl border border-slate-200 px-5 py-4 mb-3 flex-row items-center"
                          >
                            {platformConfig ? (
                              <View
                                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                                style={{
                                  backgroundColor: platformConfig.bgColor,
                                }}
                              >
                                <Ionicons
                                  name={platformConfig.icon as any}
                                  size={24}
                                  color={platformConfig.color}
                                />
                              </View>
                            ) : (
                              <View className="w-12 h-12 rounded-xl items-center justify-center mr-3 bg-slate-100">
                                <Ionicons
                                  name="globe-outline"
                                  size={20}
                                  color="#64748B"
                                />
                              </View>
                            )}

                            <View className="flex-1">
                              <Text className="text-[14px] font-poppins-bold text-slate-900">
                                {platformConfig
                                  ? platformConfig.label
                                  : social.social}
                              </Text>
                              <Text className="text-[12px] font-poppins-medium text-slate-500 mt-0.5">
                                {social.sociallink}
                              </Text>
                            </View>

                            <View className="bg-blue-50 rounded-full px-3 py-1.5 flex-row items-center">
                              <Ionicons
                                name="people"
                                size={14}
                                color="#2563EB"
                              />
                              <Text className="text-[11px] font-poppins-bold text-blue-700 ml-1">
                                {social.followers.toLocaleString()}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Bottom Action */}
              <View
                className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-100 px-5 pb-8 pt-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Pressable
                  onPress={() => setShowNewRequestModal(true)}
                  className="rounded-2xl overflow-hidden active:opacity-90 mb-3"
                >
                  <LinearGradient
                    colors={["#0A2B72", "#1E50A0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 flex-row items-center justify-center rounded-2xl"
                  >
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white text-[16px] font-poppins-bold">
                      New Request
                    </Text>
                  </LinearGradient>
                </Pressable>

                <Pressable
                  onPress={handleClose}
                  className="rounded-2xl overflow-hidden active:opacity-90"
                >
                  <View className="border border-slate-300 py-4 items-center rounded-2xl">
                    <Text className="text-slate-700 text-[16px] font-poppins-bold">
                      Close
                    </Text>
                  </View>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </Animated.View>

        {/* New Request Confirmation Modal */}
        <Modal visible={showNewRequestModal} transparent animationType="fade">
          <View
            className="flex-1 items-center justify-center px-5"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View className="bg-white rounded-3xl px-5 py-6 w-full">
              <Text className="text-[18px] font-poppins-bold text-slate-900 mb-2">
                Submit New Request?
              </Text>
              <Text className="text-[14px] font-poppins-medium text-slate-600 mb-6">
                You already have a {existingRequest.status.toLowerCase()}{" "}
                request. Do you want to submit a new one?
              </Text>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowNewRequestModal(false)}
                  className="flex-1 rounded-xl border border-slate-300 py-3 items-center active:bg-slate-50"
                >
                  <Text className="text-slate-700 font-poppins-bold text-[14px]">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleNewRequest}
                  className="flex-1 rounded-xl overflow-hidden active:opacity-90"
                >
                  <LinearGradient
                    colors={["#0A2B72", "#1E50A0"]}
                    className="py-3 items-center"
                  >
                    <Text className="text-white font-poppins-bold text-[14px]">
                      Yes, Proceed
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </Modal>
    );
  }

  // === SUCCESS STATE ===
  if (isSuccess) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => {
          refetchStatus();
          handleClose();
        }}
      >
        <Animated.View
          style={{ flex: 1, opacity: fadeAnim }}
          className="bg-black/60"
        >
          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white rounded-t-[32px] mt-12"
          >
            <View className="flex-1 items-center justify-center px-8">
              <Animated.View
                style={{ transform: [{ scale: successScale }] }}
                className="items-center"
              >
                <View className="w-28 h-28 rounded-full bg-emerald-50 items-center justify-center mb-6">
                  <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={56}
                      color="#059669"
                    />
                  </View>
                </View>

                <Text className="text-[28px] font-poppins-bold text-slate-900 text-center mb-3">
                  Request Submitted!
                </Text>
                <Text className="text-[15px] font-poppins-medium text-slate-500 text-center leading-6 mb-2">
                  Your application to become a trip host has been sent
                  successfully. Our team will review it shortly.
                </Text>
                <View className="bg-amber-50 rounded-2xl px-5 py-3 mt-4 flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#D97706" />
                  <Text className="ml-2 text-[13px] font-poppins-semibold text-amber-700">
                    Status: Pending Review
                  </Text>
                </View>
              </Animated.View>

              <Pressable
                onPress={() => {
                  refetchStatus();
                  handleClose();
                }}
                className="mt-10 w-full rounded-2xl overflow-hidden active:opacity-90"
              >
                <LinearGradient
                  colors={["#0A2B72", "#1E50A0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 items-center rounded-2xl"
                >
                  <Text className="text-white text-[16px] font-poppins-bold">
                    Done
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }

  // === FORM STATE ===
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View
        style={{ flex: 1, opacity: fadeAnim }}
        className="bg-black/60"
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-slate-50 rounded-t-[32px] mt-12"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Header */}
            <View className="px-5 pt-5 pb-3">
              <View className="w-10 h-1.5 bg-slate-300 rounded-full self-center mb-5" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  {step === 2 && (
                    <Pressable
                      onPress={goBackToStep1}
                      className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3 border border-slate-200"
                    >
                      <Ionicons name="arrow-back" size={18} color="#334155" />
                    </Pressable>
                  )}
                  <View className="flex-1">
                    <Text className="text-[22px] font-poppins-bold text-slate-900">
                      Become a Host
                    </Text>
                    <Text className="text-[13px] font-poppins-medium text-slate-500 mt-0.5">
                      {step === 1
                        ? "Tell us about yourself"
                        : "Link your social presence"}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleClose}
                  className="w-9 h-9 rounded-full bg-white items-center justify-center border border-slate-200"
                >
                  <Ionicons name="close" size={18} color="#64748B" />
                </Pressable>
              </View>

              {/* Step indicator */}
              <View className="flex-row items-center mt-5 gap-2">
                <View
                  className={`flex-1 h-1.5 rounded-full ${
                    step >= 1 ? "bg-[#0A2B72]" : "bg-slate-200"
                  }`}
                />
                <View
                  className={`flex-1 h-1.5 rounded-full ${
                    step >= 2 ? "bg-[#0A2B72]" : "bg-slate-200"
                  }`}
                />
              </View>
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {step === 1 ? (
                // ========== STEP 1: Personal Info ==========
                <View className="px-5 pt-4">
                  {/* Illustration Card */}
                  <View className="rounded-3xl overflow-hidden mb-6">
                    <LinearGradient
                      colors={["#0A2B72", "#1A3F8B", "#2A56A8"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="px-5 py-6"
                    >
                      <View className="flex-row items-center">
                        <View className="w-14 h-14 rounded-2xl bg-white/15 items-center justify-center mr-4">
                          <MaterialCommunityIcons
                            name="airplane-takeoff"
                            size={28}
                            color="#fff"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-white text-[16px] font-poppins-bold">
                            Host Amazing Trips
                          </Text>
                          <Text className="text-blue-200 text-[12px] font-poppins-medium mt-1 leading-4">
                            Share your travel passion with a community of
                            explorers and earn while doing it.
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Phone Input */}
                  <Text className="text-[13px] font-poppins-semibold text-slate-700 mb-2 ml-1">
                    Phone Number
                  </Text>
                  <View
                    className={`flex-row items-center bg-white rounded-2xl border px-4 py-1 ${
                      errors.phone ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <Ionicons name="call-outline" size={18} color="#94A3B8" />
                    <TextInput
                      value={phone}
                      onChangeText={(v) => {
                        setPhone(v);
                        if (errors.phone)
                          setErrors((e) => ({ ...e, phone: "" }));
                      }}
                      placeholder="+216 XX XXX XXX"
                      placeholderTextColor="#CBD5E1"
                      keyboardType="phone-pad"
                      className="flex-1 ml-3 py-3.5 text-[15px] font-poppins-medium text-slate-900"
                    />
                  </View>
                  {errors.phone ? (
                    <Text className="text-red-500 text-[12px] font-poppins-medium mt-1.5 ml-1">
                      {errors.phone}
                    </Text>
                  ) : null}

                  {/* Role Input */}
                  <Text className="text-[13px] font-poppins-semibold text-slate-700 mb-2 ml-1 mt-5">
                    Your Role
                  </Text>
                  <View
                    className={`flex-row items-center bg-white rounded-2xl border px-4 py-1 ${
                      errors.role ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name="briefcase-outline"
                      size={18}
                      color="#94A3B8"
                    />
                    <TextInput
                      value={role}
                      onChangeText={(v) => {
                        setRole(v);
                        if (errors.role) setErrors((e) => ({ ...e, role: "" }));
                      }}
                      placeholder="e.g. Travel Blogger, Influencer, Tour Guide"
                      placeholderTextColor="#CBD5E1"
                      className="flex-1 ml-3 py-3.5 text-[15px] font-poppins-medium text-slate-900"
                    />
                  </View>
                  {errors.role ? (
                    <Text className="text-red-500 text-[12px] font-poppins-medium mt-1.5 ml-1">
                      {errors.role}
                    </Text>
                  ) : null}
                </View>
              ) : (
                // ========== STEP 2: Social Media ==========
                <View className="px-5 pt-4">
                  {/* Info Banner */}
                  <View className="bg-blue-50 rounded-2xl px-4 py-3 flex-row items-center mb-5">
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#2563EB"
                    />
                    <Text className="ml-2 flex-1 text-[12px] font-poppins-medium text-blue-700 leading-4">
                      Fill in at least one social media account with your
                      username and follower count.
                    </Text>
                  </View>

                  {errors.socials ? (
                    <View className="bg-red-50 rounded-2xl px-4 py-3 flex-row items-center mb-4">
                      <Ionicons name="alert-circle" size={18} color="#EF4444" />
                      <Text className="ml-2 text-[12px] font-poppins-medium text-red-600">
                        {errors.socials}
                      </Text>
                    </View>
                  ) : null}

                  {/* Preset Social Platforms */}
                  <View className="mb-6">
                    <Text className="text-[13px] font-poppins-semibold text-slate-700 mb-3 ml-1">
                      Social Media Platforms
                    </Text>
                    {SOCIAL_PLATFORMS.map((platform) => {
                      const isExpanded = expandedPreset === platform.key;
                      const isFilled =
                        presetSocials[platform.key].link.trim() &&
                        presetSocials[platform.key].followers.trim();

                      return (
                        <View key={platform.key} className="mb-3">
                          <Pressable
                            onPress={() =>
                              setExpandedPreset(
                                isExpanded ? null : platform.key,
                              )
                            }
                            className={`flex-row items-center bg-white rounded-2xl border px-4 py-3.5 ${
                              isExpanded
                                ? "border-[#0A2B72] bg-blue-50/30"
                                : isFilled
                                  ? "border-emerald-300 bg-emerald-50/30"
                                  : "border-slate-200"
                            }`}
                          >
                            <View
                              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                              style={{ backgroundColor: platform.bgColor }}
                            >
                              <Ionicons
                                name={platform.icon as any}
                                size={22}
                                color={platform.color}
                              />
                            </View>
                            <Text className="flex-1 text-[14px] font-poppins-semibold text-slate-800">
                              {platform.label}
                            </Text>

                            {isFilled ? (
                              <View className="flex-row items-center">
                                <View className="bg-emerald-100 rounded-full px-2.5 py-1 mr-2 flex-row items-center">
                                  <Ionicons
                                    name="people"
                                    size={12}
                                    color="#059669"
                                  />
                                  <Text className="text-[11px] font-poppins-bold text-emerald-700 ml-1">
                                    {parseInt(
                                      presetSocials[platform.key].followers,
                                    ).toLocaleString()}
                                  </Text>
                                </View>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={20}
                                  color="#059669"
                                />
                              </View>
                            ) : (
                              <Ionicons
                                name={
                                  isExpanded ? "chevron-up" : "chevron-down"
                                }
                                size={18}
                                color="#94A3B8"
                              />
                            )}
                          </Pressable>

                          {/* Expanded Fields */}
                          {isExpanded && (
                            <View className="bg-white rounded-2xl border border-slate-200 border-t-0 -mt-1 px-4 pt-4 pb-3 rounded-t-none">
                              <View className="mb-3">
                                <Text className="text-[11px] font-poppins-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                  Username / Link
                                </Text>
                                <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-3">
                                  <TextInput
                                    value={presetSocials[platform.key].link}
                                    onChangeText={(v) =>
                                      updatePresetSocial(
                                        platform.key,
                                        "link",
                                        v,
                                      )
                                    }
                                    placeholder={platform.placeholder}
                                    placeholderTextColor="#CBD5E1"
                                    className="flex-1 py-3 text-[14px] font-poppins-medium text-slate-900"
                                  />
                                </View>
                              </View>
                              <View>
                                <Text className="text-[11px] font-poppins-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                  Followers
                                </Text>
                                <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-3">
                                  <Ionicons
                                    name="people-outline"
                                    size={16}
                                    color="#94A3B8"
                                  />
                                  <TextInput
                                    value={
                                      presetSocials[platform.key].followers
                                    }
                                    onChangeText={(v) =>
                                      updatePresetSocial(
                                        platform.key,
                                        "followers",
                                        v.replace(/[^0-9]/g, ""),
                                      )
                                    }
                                    placeholder="e.g. 10000"
                                    placeholderTextColor="#CBD5E1"
                                    keyboardType="numeric"
                                    className="flex-1 ml-2 py-3 text-[14px] font-poppins-medium text-slate-900"
                                  />
                                </View>
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {/* Custom Social Platforms */}
                  {customSocials.length > 0 && (
                    <View className="mb-6">
                      <Text className="text-[13px] font-poppins-semibold text-slate-700 mb-3 ml-1">
                        Custom Platforms
                      </Text>
                      {customSocials.map((social, idx) => {
                        const isExpanded = expandedCustomIdx === idx;
                        const isFilled =
                          social.link.trim() && social.followers.trim();

                        return (
                          <View key={idx} className="mb-3">
                            <Pressable
                              onPress={() =>
                                setExpandedCustomIdx(isExpanded ? null : idx)
                              }
                              className={`flex-row items-center bg-white rounded-2xl border px-4 py-3.5 ${
                                isExpanded
                                  ? "border-[#0A2B72] bg-blue-50/30"
                                  : isFilled
                                    ? "border-emerald-300 bg-emerald-50/30"
                                    : "border-slate-200"
                              }`}
                            >
                              <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-slate-100">
                                <Ionicons
                                  name="globe-outline"
                                  size={22}
                                  color="#64748B"
                                />
                              </View>
                              <Text className="flex-1 text-[14px] font-poppins-semibold text-slate-800">
                                {social.name || "Custom Platform"}
                              </Text>

                              {isFilled ? (
                                <View className="flex-row items-center">
                                  <View className="bg-emerald-100 rounded-full px-2.5 py-1 mr-2 flex-row items-center">
                                    <Ionicons
                                      name="people"
                                      size={12}
                                      color="#059669"
                                    />
                                    <Text className="text-[11px] font-poppins-bold text-emerald-700 ml-1">
                                      {parseInt(
                                        social.followers,
                                      ).toLocaleString()}
                                    </Text>
                                  </View>
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color="#059669"
                                  />
                                </View>
                              ) : (
                                <Ionicons
                                  name={
                                    isExpanded ? "chevron-up" : "chevron-down"
                                  }
                                  size={18}
                                  color="#94A3B8"
                                />
                              )}
                            </Pressable>

                            {/* Expanded Fields */}
                            {isExpanded && (
                              <View className="bg-white rounded-2xl border border-slate-200 border-t-0 -mt-1 px-4 pt-4 pb-3 rounded-t-none">
                                {/* Platform Name */}
                                <View className="mb-3">
                                  <Text className="text-[11px] font-poppins-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                    Platform Name
                                  </Text>
                                  <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-3">
                                    <TextInput
                                      value={social.name}
                                      onChangeText={(v) =>
                                        updateCustomSocial(idx, "name", v)
                                      }
                                      placeholder="e.g. Twitch, Snapchat, Threads"
                                      placeholderTextColor="#CBD5E1"
                                      className="flex-1 py-3 text-[14px] font-poppins-medium text-slate-900"
                                    />
                                  </View>
                                </View>

                                {/* Username / Link */}
                                <View className="mb-3">
                                  <Text className="text-[11px] font-poppins-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                    Username / Link
                                  </Text>
                                  <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-3">
                                    <TextInput
                                      value={social.link}
                                      onChangeText={(v) =>
                                        updateCustomSocial(idx, "link", v)
                                      }
                                      placeholder="@yourusername or URL"
                                      placeholderTextColor="#CBD5E1"
                                      className="flex-1 py-3 text-[14px] font-poppins-medium text-slate-900"
                                    />
                                  </View>
                                </View>

                                {/* Followers */}
                                <View className="mb-3">
                                  <Text className="text-[11px] font-poppins-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                    Followers
                                  </Text>
                                  <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-3">
                                    <Ionicons
                                      name="people-outline"
                                      size={16}
                                      color="#94A3B8"
                                    />
                                    <TextInput
                                      value={social.followers}
                                      onChangeText={(v) =>
                                        updateCustomSocial(
                                          idx,
                                          "followers",
                                          v.replace(/[^0-9]/g, ""),
                                        )
                                      }
                                      placeholder="e.g. 10000"
                                      placeholderTextColor="#CBD5E1"
                                      keyboardType="numeric"
                                      className="flex-1 ml-2 py-3 text-[14px] font-poppins-medium text-slate-900"
                                    />
                                  </View>
                                </View>

                                {/* Remove Button */}
                                <Pressable
                                  onPress={() => removeCustomSocial(idx)}
                                  className="bg-red-50 rounded-xl px-4 py-2.5 flex-row items-center justify-center active:bg-red-100"
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={16}
                                    color="#EF4444"
                                  />
                                  <Text className="ml-2 text-[13px] font-poppins-bold text-red-600">
                                    Remove
                                  </Text>
                                </Pressable>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Add Custom Platform Button */}
                  <View className="mb-4">
                    <Pressable
                      onPress={addCustomPlatform}
                      className="rounded-2xl border-2 border-dashed border-slate-400 px-4 py-3 flex-row items-center justify-center active:bg-slate-50"
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={18}
                        color="#64748B"
                      />
                      <Text className="text-[14px] font-poppins-semibold text-slate-700 ml-2">
                        Add Custom Platform
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Action */}
            <View
              className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-100 px-5 pb-8 pt-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {errors.submit ? (
                <View className="bg-red-50 rounded-xl px-4 py-2.5 flex-row items-center mb-3">
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text className="ml-2 text-[12px] font-poppins-medium text-red-600 flex-1">
                    {errors.submit}
                  </Text>
                </View>
              ) : null}

              {step === 1 ? (
                <Pressable
                  onPress={goToStep2}
                  className="rounded-2xl overflow-hidden active:opacity-90"
                >
                  <LinearGradient
                    colors={["#0A2B72", "#1E50A0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 flex-row items-center justify-center rounded-2xl"
                  >
                    <Text className="text-white text-[16px] font-poppins-bold mr-2">
                      Continue
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </LinearGradient>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-2xl overflow-hidden active:opacity-90"
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  <LinearGradient
                    colors={
                      isSubmitting
                        ? ["#64748B", "#94A3B8"]
                        : ["#0A2B72", "#1E50A0"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 flex-row items-center justify-center rounded-2xl"
                  >
                    {isSubmitting ? (
                      <>
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-white text-[16px] font-poppins-bold">
                          Submitting...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="rocket-outline"
                          size={18}
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-white text-[16px] font-poppins-bold">
                          Submit Application
                        </Text>
                        {filledSocialsCount > 0 && (
                          <View className="ml-2 bg-white/20 rounded-full px-2 py-0.5">
                            <Text className="text-white text-[11px] font-poppins-bold">
                              {filledSocialsCount} linked
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

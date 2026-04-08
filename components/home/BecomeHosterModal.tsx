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
import { SocialEntry } from "@/services/hosterService";

const { width, height } = Dimensions.get("window");

interface BecomeHosterModalProps {
  visible: boolean;
  onClose: () => void;
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

const ROLES = [
  "Youtubeur",
  "Influencer",
  "Travel Blogger",
  "Tour Guide",
  "Travel Agent",
  "Content Creator",
  "Photographer",
  "Other",
];

export default function BecomeHosterModal({
  visible,
  onClose,
}: BecomeHosterModalProps) {
  const { submitRequestAsync, isSubmitting, isSuccess, reset } =
    useHosterRequest();

  // Form state
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [socials, setSocials] = useState<
    Record<SocialPlatform, { link: string; followers: string }>
  >({
    instagram: { link: "", followers: "" },
    tiktok: { link: "", followers: "" },
    youtube: { link: "", followers: "" },
    facebook: { link: "", followers: "" },
    twitter: { link: "", followers: "" },
    linkedin: { link: "", followers: "" },
  });
  const [expandedSocial, setExpandedSocial] = useState<SocialPlatform | null>(
    null
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  }, [isSuccess]);

  const handleClose = () => {
    // Reset everything
    setPhone("");
    setRole("");
    setSocials({
      instagram: { link: "", followers: "" },
      tiktok: { link: "", followers: "" },
      youtube: { link: "", followers: "" },
      facebook: { link: "", followers: "" },
      twitter: { link: "", followers: "" },
      linkedin: { link: "", followers: "" },
    });
    setStep(1);
    setErrors({});
    setExpandedSocial(null);
    reset();
    successScale.setValue(0);
    onClose();
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{8,}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid phone number";
    if (!role) newErrors.role = "Please select your role";
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
    // Build social entries (only filled ones)
    const socialEntries: SocialEntry[] = SOCIAL_PLATFORMS.filter(
      (p) => socials[p.key].link.trim() && socials[p.key].followers.trim()
    ).map((p) => ({
      social: p.key,
      sociallink: socials[p.key].link.trim(),
      followers: parseInt(socials[p.key].followers, 10) || 0,
    }));

    if (socialEntries.length === 0) {
      setErrors({ socials: "Add at least one social media account" });
      return;
    }

    setErrors({});

    try {
      await submitRequestAsync({
        phone: phone.trim(),
        role: role.toLowerCase(),
        socials: socialEntries,
      });
    } catch (err: any) {
      setErrors({ submit: err.message || "Something went wrong" });
    }
  };

  const updateSocial = (
    platform: SocialPlatform,
    field: "link" | "followers",
    value: string
  ) => {
    setSocials((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const filledSocialsCount = SOCIAL_PLATFORMS.filter(
    (p) => socials[p.key].link.trim() && socials[p.key].followers.trim()
  ).length;

  // === SUCCESS STATE ===
  if (isSuccess) {
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
                  Your application to become a trip hoster has been sent
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
                onPress={handleClose}
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
                      <Ionicons
                        name="arrow-back"
                        size={18}
                        color="#334155"
                      />
                    </Pressable>
                  )}
                  <View className="flex-1">
                    <Text className="text-[22px] font-poppins-bold text-slate-900">
                      Become a Hoster
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

                  {/* Role Picker */}
                  <Text className="text-[13px] font-poppins-semibold text-slate-700 mb-2 ml-1 mt-5">
                    Your Role
                  </Text>
                  <Pressable
                    onPress={() => setShowRolePicker(!showRolePicker)}
                    className={`flex-row items-center bg-white rounded-2xl border px-4 py-3.5 ${
                      errors.role ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name="briefcase-outline"
                      size={18}
                      color="#94A3B8"
                    />
                    <Text
                      className={`flex-1 ml-3 text-[15px] font-poppins-medium ${
                        role ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {role || "Select your role"}
                    </Text>
                    <Ionicons
                      name={showRolePicker ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#94A3B8"
                    />
                  </Pressable>
                  {errors.role ? (
                    <Text className="text-red-500 text-[12px] font-poppins-medium mt-1.5 ml-1">
                      {errors.role}
                    </Text>
                  ) : null}

                  {/* Role Dropdown */}
                  {showRolePicker && (
                    <View className="bg-white rounded-2xl border border-slate-200 mt-2 overflow-hidden">
                      {ROLES.map((r, i) => (
                        <Pressable
                          key={r}
                          onPress={() => {
                            setRole(r);
                            setShowRolePicker(false);
                            if (errors.role)
                              setErrors((e) => ({ ...e, role: "" }));
                          }}
                          className={`flex-row items-center px-4 py-3.5 ${
                            i < ROLES.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          } ${
                            role === r ? "bg-blue-50" : "active:bg-slate-50"
                          }`}
                        >
                          <Text
                            className={`flex-1 text-[14px] ${
                              role === r
                                ? "font-poppins-bold text-[#0A2B72]"
                                : "font-poppins-medium text-slate-700"
                            }`}
                          >
                            {r}
                          </Text>
                          {role === r && (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#0A2B72"
                            />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}
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
                      <Ionicons
                        name="alert-circle"
                        size={18}
                        color="#EF4444"
                      />
                      <Text className="ml-2 text-[12px] font-poppins-medium text-red-600">
                        {errors.socials}
                      </Text>
                    </View>
                  ) : null}

                  {/* Social Cards */}
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isExpanded = expandedSocial === platform.key;
                    const isFilled =
                      socials[platform.key].link.trim() &&
                      socials[platform.key].followers.trim();

                    return (
                      <View key={platform.key} className="mb-3">
                        <Pressable
                          onPress={() =>
                            setExpandedSocial(
                              isExpanded ? null : platform.key
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
                                    socials[platform.key].followers
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
                                  value={socials[platform.key].link}
                                  onChangeText={(v) =>
                                    updateSocial(platform.key, "link", v)
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
                                  value={socials[platform.key].followers}
                                  onChangeText={(v) =>
                                    updateSocial(
                                      platform.key,
                                      "followers",
                                      v.replace(/[^0-9]/g, "")
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

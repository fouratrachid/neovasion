import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "@/services/authService";

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.signUpStep1(
        email.trim(),
        firstName.trim(),
        lastName.trim(),
      );
      Alert.alert("Success", response.message || "OTP sent successfully");

      // Proceed to the OTP screen with the user's email
      router.push({
        pathname: "/(auth)/otp",
        params: { email: email.trim() },
      });
    } catch (error: any) {
      Alert.alert(
        "Sign Up Failed",
        error.message || "Unable to process your request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Graphic/Back */}
          <View className="px-6 pt-10 pb-8 flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white border border-slate-200 rounded-full items-center justify-center -ml-2"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#334155"
              />
            </Pressable>
          </View>

          {/* Form Content */}
          <View className="flex-1 px-6 pb-10">
            <View className="mb-10">
              <Text className="text-[32px] font-poppins-bold text-slate-900 leading-[44px]">
                Create {"\n"}Account
              </Text>
              <Text className="text-[15px] font-poppins-medium text-slate-500 mt-2">
                Start your unforgettable journey with us!
              </Text>
            </View>

            <View className="space-y-5 flex-col gap-5">
              {/* First Name Input */}
              <View>
                <Text className="text-[13px] font-poppins-bold text-slate-700 mb-1.5 uppercase tracking-wider ml-1">
                  First Name
                </Text>
                <View
                  className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-1 h-14 tracking-wide shadow-sm"
                  style={{
                    shadowColor: "#94A3B8",
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={22}
                    color="#64748B"
                  />
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter your first name"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 ml-3 text-[15px] font-poppins-medium text-slate-900 h-full"
                  />
                </View>
              </View>

              {/* Last Name Input */}
              <View>
                <Text className="text-[13px] font-poppins-bold text-slate-700 mb-1.5 uppercase tracking-wider ml-1">
                  Last Name
                </Text>
                <View
                  className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-1 h-14 tracking-wide shadow-sm"
                  style={{
                    shadowColor: "#94A3B8",
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-details-outline"
                    size={22}
                    color="#64748B"
                  />
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter your last name"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 ml-3 text-[15px] font-poppins-medium text-slate-900 h-full"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-[13px] font-poppins-bold text-slate-700 mb-1.5 uppercase tracking-wider ml-1">
                  Email
                </Text>
                <View
                  className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-1 h-14 tracking-wide shadow-sm"
                  style={{
                    shadowColor: "#94A3B8",
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={22}
                    color="#64748B"
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 ml-3 text-[15px] font-poppins-medium text-slate-900 h-full"
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="mt-10">
              <Pressable
                onPress={handleSignUp}
                disabled={isLoading}
                className="h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-sm"
                style={{
                  shadowColor: "#2563EB",
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-[16px] font-poppins-bold">
                    Continue
                  </Text>
                )}
              </Pressable>

              <View className="mt-8 flex-row items-center justify-center">
                <Text className="text-slate-500 font-poppins-medium text-[14px]">
                  Already have an account?{" "}
                </Text>
                <Pressable onPress={() => router.push("/(auth)/sign-in")}>
                  <Text className="text-blue-600 font-poppins-bold text-[14px]">
                    Log In
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

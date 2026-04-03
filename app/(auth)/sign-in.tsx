
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";

export default function SignInScreen() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuthStore();
  
  const [email, setEmail] = useState("mohsen@gmail.com"); 
  const [password, setPassword] = useState("123456");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both your email and password.");
      return;
    }

    try {
      await login(email.trim(), password);
      // Let the Root Layout router watcher take control upon successful authentication
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials. Please try again.");
    } 
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header Graphic/Back */}
          <View className="px-6 pt-10 pb-8 flex-row items-center">
            <Pressable 
              onPress={() => router.back()}
              className="w-10 h-10 bg-white border border-slate-200 rounded-full items-center justify-center -ml-2"
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#334155" />
            </Pressable>
          </View>

          {/* Form Content */}
          <View className="flex-1 px-6">
            <View className="mb-10">
              <Text className="text-[32px] font-poppins-bold text-slate-900 leading-[44px]">
                Welcome {"\n"}Back!
              </Text>
              <Text className="text-[15px] font-poppins-medium text-slate-500 mt-2">
                Sign in to continue planning your trips.
              </Text>
            </View>

            <View className="space-y-5">
              {/* Email Input */}
              <View>
                <Text className="text-[13px] font-poppins-bold text-slate-700 mb-1.5 uppercase tracking-wider ml-1">Email</Text>
                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-1 h-14 tracking-wide shadow-sm" style={{ shadowColor: "#94A3B8", shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}>
                  <MaterialCommunityIcons name="email-outline" size={22} color="#64748B" />
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

              {/* Password Input */}
              <View className="mt-5">
                <Text className="text-[13px] font-poppins-bold text-slate-700 mb-1.5 uppercase tracking-wider ml-1">Password</Text>
                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-1 h-14 shadow-sm" style={{ shadowColor: "#94A3B8", shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}>
                  <MaterialCommunityIcons name="lock-outline" size={22} color="#64748B" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={secureTextEntry}
                    className="flex-1 ml-3 text-[15px] font-poppins-medium text-slate-900 h-full"
                  />
                  <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)} className="p-1">
                    <MaterialCommunityIcons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={22} color="#94A3B8" />
                  </Pressable>
                </View>
                
                <Pressable className="mt-3 items-end">
                   <Text className="text-blue-600 font-poppins-semibold text-[13px]">Forgot Password?</Text>
                </Pressable>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="mt-10">
              <Pressable 
                onPress={handleLogin}
                disabled={isLoginLoading}
                className="h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-sm"
                style={{ shadowColor: "#2563EB", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, opacity: isLoginLoading ? 0.7 : 1 }}
              >
                {isLoginLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-[16px] font-poppins-bold">Login</Text>
                )}
              </Pressable>

              <View className="mt-8 flex-row items-center justify-center">
                <Text className="text-slate-500 font-poppins-medium text-[14px]">Don't have an account? </Text>
                <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                  <Text className="text-blue-600 font-poppins-bold text-[14px]">Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

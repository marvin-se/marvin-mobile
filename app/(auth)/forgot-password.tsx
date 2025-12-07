import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email required",
        text2: "Please enter your university email.",
      });      
      return;
    }

    Toast.show({
      type: "success",
      text1: "Email sent!",
      text2: "Check your inbox for the verification code.",
    });    

    router.push("/(auth)/verification/reset");
  };

  return (
    <View className="flex-1 bg-[#fdf6e3] px-8 pt-20">

      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        className="absolute top-12 left-6"
      >
        <Ionicons name="chevron-back" size={28} color="#182c53" />
      </TouchableOpacity>

      <View className="flex-1 justify-between py-10">
        <View>
          <View>
            <Text className="text-3xl font-extrabold text-[#182c53] text-center">
              Forgot Password
            </Text>

            <Text className="text-center text-[#5a6778] mt-3 text-base">
              Enter your university email to receive a{"\n"}
              password reset link.
            </Text>
          </View>

          <View className="mt-10">
            <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
              University Email
            </Text>

            <View className="border border-[#bfc7d1] rounded-2xl px-2">
              <TextInput
                placeholder="yourname@university.edu"
                placeholderTextColor="#a0a7b4"
                className="text-[#182c53] text-base"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleReset}
          className="bg-[#72c69b] rounded-2xl py-4 shadow-md"
        >
          <Text className="text-white text-center text-lg font-bold">
            Send Reset Link
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;

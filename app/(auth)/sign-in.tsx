import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/images/auth.png")}
      resizeMode="cover"
      className="flex-1 justify-center px-8"
    >
      <View className="absolute inset-0 bg-[#fdf6e3]/60" />

      <View className="px-4">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-24 h-24 mx-auto mb-6"
          resizeMode="contain"
        />

        <Text className="text-3xl font-extrabold text-center text-[#182c53] mb-6 leading-tight">
          Sign In to{"\n"}CampusTrade
        </Text>

        <Text className="text-[#182c53] text-base font-semibold mb-2">
          University Email
        </Text>

        <TextInput
          placeholder="yourname@university.edu"
          placeholderTextColor="#a0a7b4"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 bg-white mb-4"
        />

        <Text className="text-[#182c53] text-base font-semibold mb-2">
          Password
        </Text>

        <View className="flex-row items-center border border-gray-300 rounded-2xl bg-white mb-2">
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            className="flex-1 px-4 py-3 text-gray-900"
            style={{ fontFamily: "monospace" }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="px-4"
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          className="self-end mb-6"
        >
          <Text className="text-[#182c53] font-semibold underline">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-[#72c69b] rounded-2xl py-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign In
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-700 text-base">Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text className="text-[#182c53] font-semibold underline">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignIn;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const universities = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "UCLA",
  "Princeton University",
  "Yale University",
].map((u) => ({ label: u, value: u }));

const SignUp = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [openDropdown, setOpenDropdown] = useState(false);
  const [university, setUniversity] = useState(null);
  const [items, setItems] = useState(universities);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

            <Text className="text-3xl font-extrabold text-center text-[#182c53] mb-6">
              Create your account
            </Text>

            <View className="flex-row justify-between mb-2">
              <View className="flex-1 mr-2">
                <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
                  First Name
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  className="border border-gray-300 rounded-2xl bg-white px-4 py-3 text-gray-900"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
                  Last Name
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  className="border border-gray-300 rounded-2xl bg-white px-4 py-3 text-gray-900"
                />
              </View>
            </View>

            <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
              University Selection
            </Text>

            <DropDownPicker
              open={openDropdown}
              value={university}
              items={items}
              setOpen={setOpenDropdown}
              setValue={setUniversity}
              setItems={setItems}
              placeholder="Select your university"
              style={{
                borderRadius: 16,
                borderColor: "#d1d5db",
              }}
              dropDownContainerStyle={{
                borderRadius: 16,
                borderColor: "#d1d5db",
              }}
              zIndex={1000}
            />

            <Text className="text-[#182c53] text-base font-semibold mb-2 mt-2 ml-2">
              University Email
            </Text>
            <TextInput
              placeholder="yourname@university.edu"
              placeholderTextColor="#a0a7b4"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 rounded-2xl bg-white px-4 py-3 mb-2 text-gray-900"
            />

            <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
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

            <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
              Confirm Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-2xl bg-white mb-4">
              <TextInput
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="flex-1 px-4 py-3 text-gray-900"
                style={{ fontFamily: "monospace" }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-4"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/verification/email")}
              className="bg-[#72c69b] rounded-2xl py-4 mb-4"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-[#182c53]">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text className="text-[#182c53] font-semibold underline">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

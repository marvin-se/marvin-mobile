import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

const Verification = () => {
  const router = useRouter();
  const { verify } = useLocalSearchParams();

  const isEmailVerification = verify === "email";

  const title = isEmailVerification ? "Verify Your Email" : "Password Reset Code";
  const subtitle = "Please enter the 6-digit code sent to your university email address.";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (value: any, index: any) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = () => {
    if (code.join("").length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: "Please enter all 6 digits.",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Verified!",
      text2: isEmailVerification
        ? "Your email has been verified."
        : "Your reset code is valid.",
    });

    setTimeout(() => {
      if (isEmailVerification) {
        router.push("/(auth)/sign-in");
      } else {
        router.push("/(auth)/reset-password");
      }
    }, 800);
  };

  return (
    <View className="flex-1 bg-[#fdf6e3]/60 px-8 pt-20">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-6"
      >
        <Ionicons name="chevron-back" size={28} color="#182c53" />
      </TouchableOpacity>

      <View className="flex-1 justify-between py-10">
        <View>
          <Text className="text-3xl font-extrabold text-[#182c53] text-center">
            {title}
          </Text>
          <Text className="text-center text-[#5a6778] mt-5 text-base leading-6">
            {subtitle}
          </Text>

          <View className="flex-row justify-between px-3 mt-12">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                className="w-12 h-14 border border-[#c7cdd8] rounded-xl text-center text-xl text-[#182c53] bg-white"
              />
            ))}
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={handleVerify}
            className="bg-[#72c69b] rounded-2xl py-4 shadow-md mb-8"
          >
            <Text className="text-white text-center text-lg font-bold">
              Verify & Continue
            </Text>
          </TouchableOpacity>

          <View>
            <Text className="text-center text-[#182c53]">
              Didn't receive the email?{" "}
              <Text className="text-[#72c69b] font-semibold">Resend Email</Text>
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-center mt-6 text-lg font-bold text-[#182c53]">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Verification;
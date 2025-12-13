import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  information: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, information, onBack }) => {
  const router = useRouter();

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={onBack || (() => router.back())}
      >
        <Ionicons name="chevron-back" size={28} color="#182c53" />
      </TouchableOpacity>
      <Text className="text-3xl font-extrabold text-center text-[#182c53]">
        {title}
      </Text>
      <Text className="text-center text-[#5a6778] mt-3 text-base">
        {information}
      </Text>
    </View>
  );
};

export default Header;
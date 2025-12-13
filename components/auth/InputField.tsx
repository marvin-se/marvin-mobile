import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  showToggle = false,
  onToggle,
  placeholder,
  keyboardType = "default",
}) => {
  return (
    <View className="mb-4">
      <Text className="text-[#182c53] text-base font-semibold ml-2 mb-2">
        {label}
      </Text>
      <View className="flex-row items-center border border-gray-300 rounded-2xl bg-white">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          keyboardType={keyboardType}
          className="flex-1 px-4 py-3 -gray-900"
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} className="px-4">
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;
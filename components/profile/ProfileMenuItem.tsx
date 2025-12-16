import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

interface ProfileMenuItemProps {
    icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap;
    iconLibrary?: "MaterialIcons" | "Ionicons";
    title: string;
    onPress: () => void;
    showBorder?: boolean;
    textColor?: string;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
    icon,
    iconLibrary = "MaterialIcons",
    title,
    onPress,
    showBorder = true,
    textColor = "text-textPrimary",
}) => {
    const IconComponent = iconLibrary === "Ionicons" ? Ionicons : MaterialIcons;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center justify-between px-5 py-4 bg-white ${showBorder ? "border-b border-borderPrimary" : ""
                }`}
            activeOpacity={0.5}
        >
            <View className="flex-row items-center gap-3">
                <IconComponent name={icon as any} size={24} color="#72C69B" />
                <Text className={`text-lg font-medium ${textColor}`}>{title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
        </TouchableOpacity>
    );
};

export default ProfileMenuItem;
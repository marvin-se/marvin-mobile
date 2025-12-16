import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Switch, Text, View } from "react-native";

interface SettingToggleProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    showBorder?: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
    icon,
    title,
    description,
    value,
    onValueChange,
    showBorder = true,
}) => {
    return (
        <View
            className={`flex-row items-center justify-between px-5 py-4 bg-white ${showBorder ? "border-b border-borderPrimary" : ""
                }`}
        >
            <View className="flex-row items-center gap-3 flex-1">
                <MaterialIcons name={icon} size={24} color="#72C69B" />
                <View className="flex-1">
                    <Text className="text-lg font-medium text-textPrimary">{title}</Text>
                    {description && (
                        <Text className="text-sm text-textSecondary mt-1">{description}</Text>
                    )}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#d1d5db", true: "#72C69B" }}
                thumbColor="#ffffff"
            />
        </View>
    );
};

export default SettingToggle;
import React from "react";
import { Text, View } from "react-native";

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
    return (
        <View className="mt-6">
            <Text className="text-sm font-semibold text-textSecondary px-5 mb-2 uppercase">
                {title}
            </Text>
            <View className="bg-white">{children}</View>
        </View>
    );
};

export default ProfileSection;
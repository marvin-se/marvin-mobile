import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ProfileHeaderProps {
    name: string;
    email: string;
    avatar: string;
    university: string;
    showBackButton?: boolean;
    showEditButton?: boolean;
    onEditPress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    email,
    avatar,
    university,
    showBackButton = false,
    showEditButton = false,
    onEditPress,
}) => {
    const router = useRouter();

    return (
        <View className="items-center py-6 bg-white border-b border-borderPrimary">
            {showBackButton && (
                <TouchableOpacity
                    className="absolute left-5 top-6"
                    onPress={() => router.back()}
                    activeOpacity={0.5}
                >
                    <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
            )}

            <Image
                source={{ uri: avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                contentFit="cover"
            />

            <Text className="text-2xl font-bold text-textPrimary mt-4">{name}</Text>
            <Text className="text-base text-textSecondary mt-1">{email}</Text>
            <Text className="text-sm text-textSecondary mt-1">{university}</Text>

            {showEditButton && onEditPress && (
                <TouchableOpacity
                    onPress={onEditPress}
                    className="mt-4 bg-primary px-6 py-2 rounded-full"
                    activeOpacity={0.5}
                >
                    <Text className="text-white font-semibold">Edit Profile</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ProfileHeader;
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
        <View className="py-6 px-5 bg-white border-b border-borderPrimary relative">
            {showBackButton && (
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.5}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ position: 'absolute', left: 20, top: 24, zIndex: 10 }}
                >
                    <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
            )}

            {showEditButton && onEditPress && (
                <TouchableOpacity
                    onPress={onEditPress}
                    activeOpacity={0.5}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ position: 'absolute', right: 20, top: 24, zIndex: 10 }}
                >
                    <MaterialIcons name="edit" size={24} color="#72C69B" />
                </TouchableOpacity>
            )}

            <View className="flex-row justify-between items-center">
                <Image
                    source={{ uri: avatar }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                    contentFit="cover"
                />

                <View className="flex-1 ml-4">
                    <Text className="text-xl font-bold text-textPrimary">{name}</Text>
                    <Text className="text-sm text-textSecondary mt-1">{email}</Text>
                    <Text className="text-sm text-textSecondary mt-1">{university}</Text>
                </View>
            </View>
        </View>
    );
};

export default ProfileHeader;
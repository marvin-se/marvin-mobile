import { authService } from "@/api/services/auth";
import Button from "@/components/auth/Button";
import InputField from "@/components/auth/InputField";
import { useAuthStore } from "@/store/useAuthStore";
import { getAvatarUrl } from "@/utils/avatar";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const EditProfile = () => {
    const router = useRouter();
    const { user, setUser } = useAuthStore();

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [phone, setPhone] = useState(user?.phoneNumber || "");

    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState(user?.profilePicUrl || "");

    const email = user?.email || "";
    const university = user?.universityName || "";
    const handlePickAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Toast.show({ type: 'error', text1: 'Permission to access gallery is required!' });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            try {
                const presign = await authService.getProfilePicturePresign();
                await authService.uploadProfilePicture(presign.uploadUrl, imageUri, 'image/jpeg');
                await authService.setProfilePicture(presign.key);
                const { url } = await authService.getMyProfilePicture();
                setAvatar(url);
                Toast.show({ type: 'success', text1: 'Profile picture updated!' });
            } catch (error: any) {
                Toast.show({ type: 'error', text1: 'Failed to update profile picture', text2: error.message });
            }
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Name cannot be empty.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const updatedUser = await authService.updateProfile({ 
                fullName, 
                phoneNumber: phone 
            });

            setUser(updatedUser);

            Toast.show({
                type: "success",
                text1: "Profile Updated",
                text2: "Your profile has been successfully updated.",
            });
            router.back();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Update Failed",
                text2: error.message || "Could not update profile.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-textSecondary">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-background h-full">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="px-5 border-b border-b-borderPrimary pb-4 mb-5">
                    <View className="flex flex-row items-center justify-center mt-5 relative">
                        <Text className="text-2xl font-bold text-textPrimary">Edit Profile</Text>
                        <TouchableOpacity
                            className="absolute left-0"
                            onPress={() => router.back()}
                            activeOpacity={0.5}
                        >
                            <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="items-center mb-6">
                        <View className="relative">
                            <Image
                                source={{ uri: getAvatarUrl(fullName, avatar) }}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                                contentFit="cover"
                            />
                            <TouchableOpacity
                                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"
                                activeOpacity={0.5}
                                onPress={handlePickAvatar}
                            >
                                <MaterialIcons name="camera-alt" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="px-5">
                        <InputField
                            label="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        <View className="mb-4">
                            <Text className="text-[#182c53] text-base font-semibold ml-2 mb-2">
                                Email
                            </Text>
                            <View className="border border-gray-300 rounded-2xl bg-gray-100 px-4 py-3">
                                <Text className="text-gray-500">{email}</Text>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[#182c53] text-base font-semibold ml-2 mb-2">
                                University
                            </Text>
                            <View className="border border-gray-300 rounded-2xl bg-gray-100 px-4 py-3">
                                <Text className="text-gray-500">{university}</Text>
                            </View>
                        </View>

                        <InputField
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="numeric"
                        />

                        <Button 
                            title={isLoading ? "Saving..." : "Save Changes"} 
                            onPress={handleSave}
                            disabled={isLoading}
                        />

                        <View className="h-4" />

                        <Button
                            title="Cancel"
                            onPress={() => router.back()}
                            variant="secondary"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfile;
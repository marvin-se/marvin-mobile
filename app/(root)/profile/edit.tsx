import { authService } from "@/api/services/auth";
import { productService } from "@/api/services/product";
import Button from "@/components/auth/Button";
import InputField from "@/components/auth/InputField";
import Avatar from "@/components/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { MaterialIcons } from "@expo/vector-icons";
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
    // Use user's profile pic or null initially.
    // If it's a URL, it's from backend. If it's a file path, it's a new selection.
    const [avatar, setAvatar] = useState<string | undefined>(user?.profilePicUrl);

    // Update local state when user changes to ensure sync if they come back or whatever,
    // actually we just want to initialize it.

    // Handler for picking image
    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Toast.show({ type: 'error', text1: 'Permission to access gallery is required!' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const email = user?.email || "";
    const university = user?.universityName || "";

    const handleSave = async () => {
        if (!user) return;

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
            // 1. Handle Profile Picture Upload if changed (local file URI)
            if (avatar && avatar !== user.profilePicUrl && !avatar.startsWith("http")) {
                const fileName = avatar.split('/').pop() || `profile_${Date.now()}.jpg`;
                const contentType = 'image/jpeg'; // Assuming jpeg for now from picker

                // A. Presign
                const presignRes = await authService.presignProfilePicture({
                    fileName,
                    contentType
                });

                // B. Upload to S3
                await productService.uploadImageToS3(presignRes.uploadUrl, avatar, contentType);

                // C. Save Key to Profile
                await authService.saveProfilePicture({
                    key: presignRes.key
                });
            }

            // 2. Update Profile Details
            await authService.updateProfile({
                fullName,
                phoneNumber: phone
            });

            // 3. Refresh user to get new profile pic url
            // getCurrentUser now automatically fetches and attaches the signed profile picture URL
            const freshUser = await authService.getCurrentUser();

            setUser(freshUser);

            Toast.show({
                type: "success",
                text1: "Profile Updated",
                text2: "Your profile has been successfully updated.",
            });
            router.back();
        } catch (error: any) {
            console.error(error);
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
                            <Avatar uri={avatar} name={fullName} size={100} />
                            <TouchableOpacity
                                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"
                                activeOpacity={0.5}
                                onPress={handlePickImage}
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
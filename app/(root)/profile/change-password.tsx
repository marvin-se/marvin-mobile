import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import InputField from "@/components/auth/InputField";
import Button from "@/components/auth/Button";
import { authService } from "@/api/services/auth";
import { RequestType } from "@/types/auth";
import { useAuthStore } from "@/store/useAuthStore";

const ChangePassword = () => {
    const router = useRouter();
    const { user } = useAuthStore();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please enter your current password",
            });
            return;
        }

        if (!newPassword) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please enter a new password",
            });
            return;
        }

        if (!validatePassword(newPassword)) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password must be at least 8 characters",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Passwords do not match",
            });
            return;
        }

        if (currentPassword === newPassword) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "New password must be different from current password",
            });
            return;
        }

        setIsLoading(true);

        try {
            await authService.changePassword({
                email: user?.email ?? "",
                token: null,
                oldPassword: null,
                newPassword: newPassword,
                confirmNewPassword: confirmPassword,
                type: RequestType.FORGOT_PASSWORD
            });

            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Your password has been changed",
            });

            router.back();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Could not change password",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="px-5 border-b border-b-borderPrimary pb-4 mb-5">
                    <View className="flex flex-row items-center justify-center mt-5 relative">
                        <Text className="text-2xl font-bold text-textPrimary">
                            Change Password
                        </Text>
                        <TouchableOpacity
                            className="absolute left-0"
                            onPress={() => router.back()}
                            activeOpacity={0.5}
                        >
                            <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1 px-5"
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="text-textSecondary text-base mb-6">
                        Enter your current password and choose a new password.
                    </Text>

                    <View className="">
                        <InputField
                            label="Current Password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showCurrentPassword}
                            showToggle
                            onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                        />
                        <InputField
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            showToggle
                            onToggle={() => setShowNewPassword(!showNewPassword)}
                        />
                        <InputField
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            showToggle
                            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </View>
                    <View className="mt-8">
                        <Button
                            title="Change Password"
                            onPress={handleChangePassword}
                            disabled={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;
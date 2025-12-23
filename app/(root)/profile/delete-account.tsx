import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/api/services/auth";

const DeleteAccount = () => {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: confirmDelete,
                },
            ]
        );
    };

    const confirmDelete = async () => {
        setIsLoading(true);

        try {
            await authService.deleteAccount();
            await logout();

            Toast.show({
                type: "success",
                text1: "Account Deleted",
                text2: "Your account has been permanently deleted",
            });

            router.replace("/(auth)/sign-in");
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Could not delete account",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <View className="px-5 border-b border-b-borderPrimary pb-4 mb-5">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">
                        Delete Account
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

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
                <View className="items-center mt-8 mb-8">
                    <View className="bg-red-100 p-6 rounded-full mb-4">
                        <MaterialIcons name="warning" size={64} color="#EF4444" />
                    </View>
                    <Text className="text-2xl font-bold text-textPrimary text-center">
                        We're sorry to see you go
                    </Text>
                </View>

                <View className="bg-red-50 p-4 rounded-xl mb-6">
                    <Text className="text-red-600 font-semibold text-lg mb-2">
                        Warning: This action is irreversible
                    </Text>
                    <Text className="text-red-500 text-base">
                        Once you delete your account, all your data will be permanently removed and cannot be recovered.
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-xl mb-6">
                    <Text className="text-textPrimary font-semibold text-lg mb-3">
                        What will be deleted:
                    </Text>
                    
                    <View className="gap-3">
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="person" size={24} color="#7F8C8D" />
                            <Text className="text-textSecondary text-base">
                                Your profile information
                            </Text>
                        </View>
                        
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="storefront" size={24} color="#7F8C8D" />
                            <Text className="text-textSecondary text-base">
                                All your listings
                            </Text>
                        </View>
                        
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="chat" size={24} color="#7F8C8D" />
                            <Text className="text-textSecondary text-base">
                                Your messages and conversations
                            </Text>
                        </View>
                        
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="favorite" size={24} color="#7F8C8D" />
                            <Text className="text-textSecondary text-base">
                                Your favorites
                            </Text>
                        </View>
                        
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="history" size={24} color="#7F8C8D" />
                            <Text className="text-textSecondary text-base">
                                Transaction history
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleDeleteAccount}
                    disabled={isLoading}
                    className={`py-4 rounded-xl mb-4 ${isLoading ? "bg-red-300" : "bg-red-500"}`}
                    activeOpacity={0.7}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text className="text-white text-center font-semibold text-lg">
                            Delete My Account
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    className="py-4 rounded-xl border border-borderPrimary mb-8"
                    activeOpacity={0.7}
                >
                    <Text className="text-textPrimary text-center font-semibold text-lg">
                        Keep My Account
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DeleteAccount;
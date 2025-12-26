import { authService } from "@/api/services/auth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";
import ProfileSection from "@/components/profile/ProfileSection";
import StatCard from "@/components/profile/StatCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const router = useRouter();
    const { user, logout, setUser } = useAuthStore();
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const refreshProfilePic = async () => {
                if (!user) return;
                try {
                    const picRes = await authService.getProfilePicture();
                    if (picRes.url && picRes.url !== user.profilePicUrl) {
                        // Update store only if different to avoid potential loops if strict equality check fails?
                        // Actually, just updating the user object with new URL is fine.
                        setUser({ ...user, profilePicUrl: picRes.url });
                    }
                } catch (error) {
                    console.error("Failed to refresh profile picture:", error);
                }
            };
            refreshProfilePic();
        }, [user?.id]) // Depend on user ID so we don't loop but do refresh if user changes logic
    );

    const userStats = {
        activeListings: products.filter(p => p.sellerId === user?.id && p.status !== "SOLD").length,
        soldItems: products.filter(p => p.sellerId === user?.id && p.status === "SOLD").length,
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/(auth)/sign-in");
                    },
                },
            ]
        );
    };

    if (!user) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-textSecondary">
                        Loading...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-background h-full">
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileHeader
                    name={user.fullName}
                    email={user.email}
                    avatar={user.profilePicUrl}
                    university={user.universityName}
                    showEditButton
                    onEditPress={() => router.push("/profile/edit")}
                />

                <View className="flex-row gap-3 px-5 mt-6">
                    <StatCard label="Active Listings" value={userStats.activeListings} />
                    <StatCard label="Sold Items" value={userStats.soldItems} />
                </View>

                <ProfileSection title="My Items">
                    <ProfileMenuItem
                        icon="storefront"
                        title="My Listings"
                        onPress={() => router.push("/profile/my-listings")}
                    />
                    <ProfileMenuItem
                        icon="history"
                        title="Transaction History"
                        onPress={() => router.push("/profile/history")}
                        showBorder={false}
                    />
                </ProfileSection>

                <ProfileSection title="Account">
                    <ProfileMenuItem
                        icon="help-outline"
                        title="FAQ"
                        onPress={() => router.push("/profile/faq")}
                    />
                    <ProfileMenuItem
                        icon="block"
                        title="Blocked Users"
                        onPress={() => router.push("/profile/blocked-users")}
                    />
                    <ProfileMenuItem
                        icon="lock"
                        title="Change Password"
                        onPress={() => router.push("/profile/change-password")}
                        showBorder={false}
                    />
                </ProfileSection>

                <View className="px-5 mt-6 mb-10 gap-3">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-center py-4 bg-white border border-red-400 rounded-xl"
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="logout" size={22} color="#EF4444" />
                        <Text className="text-red-500 text-lg font-semibold ml-2">Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/profile/delete-account")}
                        className="flex-row items-center justify-center py-4 rounded-xl"
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="delete-outline" size={22} color="#9CA3AF" />
                        <Text className="text-gray-400 text-base font-medium ml-2">Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
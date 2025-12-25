import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";
import ProfileSection from "@/components/profile/ProfileSection";
import StatCard from "@/components/profile/StatCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, []);

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
                        icon="lock"
                        title="Change Password"
                        onPress={() => router.push("/profile/change-password")}
                    />
                    <ProfileMenuItem
                        icon="logout"
                        title="Logout"
                        onPress={handleLogout}
                        textColor="text-red-500"
                    />
                    <ProfileMenuItem
                        icon="delete"
                        title="Delete Account"
                        onPress={() => { }}
                        showBorder={false}
                        textColor="text-red-500"
                    />
                </ProfileSection>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";
import ProfileSection from "@/components/profile/ProfileSection";
import StatCard from "@/components/profile/StatCard";
import { useRouter } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const router = useRouter();

    const user = {
        name: "John Doe",
        email: "john.doe@university.edu",
        avatar: "https://i.pravatar.cc/150?img=12",
        university: "Harvard University",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum mollis aliquam neque, id pulvinar nisl tincidunt et. Vestibulum tincidunt libero.",
        stats: {
            listings: 12,
            sold: 8,
            bought: 15,
        },
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
                    onPress: () => router.replace("/(auth)/sign-in"),
                },
            ]
        );
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileHeader
                    name={user.name}
                    email={user.email}
                    avatar={user.avatar}
                    university={user.university}
                    bio={user.bio}
                    showEditButton
                    onEditPress={() => router.push("/profile/edit")}
                />

                <View className="flex-row gap-3 px-5 mt-6">
                    <StatCard label="Active Listings" value={user.stats.listings} />
                    <StatCard label="Sold Items" value={user.stats.sold} />
                    <StatCard label="Purchased" value={user.stats.bought} />
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
                        icon="settings"
                        title="Settings"
                        onPress={() => router.push("/profile/settings")}
                    />
                    <ProfileMenuItem
                        icon="help-outline"
                        title="FAQ"
                        onPress={() => router.push("/profile/faq")}
                    />
                    <ProfileMenuItem
                        icon="logout"
                        title="Logout"
                        onPress={handleLogout}
                        showBorder={false}
                        textColor="text-red-500"
                    />
                </ProfileSection>

                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
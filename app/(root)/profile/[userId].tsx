import { authService } from "@/api/services/auth";
import { productService } from "@/api/services/product";
import MyListingCard from "@/components/profile/MyListingCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatCard from "@/components/profile/StatCard";
import TabSelector from "@/components/profile/TabSelector";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types/api";
import { User } from "@/types/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UserProfile = () => {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();
    const { imageUrlCache, cacheImageUrls } = useProductStore();

    const [user, setUser] = useState<User | null>(null);
    const [listings, setListings] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const fetchUserData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const [userData, userListings] = await Promise.all([
                authService.getUserById(Number(userId)),
                productService.getUserListings(Number(userId)),
            ]);

            setUser(userData);
            setListings(userListings);

            // Preload images for listings
            for (const listing of userListings) {
                if (listing.images && listing.images.length > 0) {
                    const firstImage = listing.images[0];
                    if (firstImage.startsWith('products/') && !imageUrlCache[listing.id]) {
                        try {
                            const response = await productService.getProductImages(listing.id);
                            if (response.images && response.images.length > 0) {
                                const urls = response.images.map(img => img.url);
                                cacheImageUrls(listing.id, urls);
                            }
                        } catch (imgError) {
                            console.error("Failed to load images for listing", listing.id);
                        }
                    }
                }
            }
        } catch (err: any) {
            const errorMessage = typeof err === 'string'
                ? err
                : err?.message || "Failed to load profile";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const activeListings = listings.filter(item => item.status !== "SOLD");
    const soldListings = listings.filter(item => item.status === "SOLD");
    const displayListings = activeTab === 0 ? activeListings : soldListings;

    const handleListingPress = (id: number) => {
        router.push(`/details/${id}`);
    };

    if (isLoading) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#72C69B" />
                    <Text className="text-textSecondary mt-4">Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !user) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center px-5">
                    <MaterialIcons name="error-outline" size={64} color="#CDD5E0" />
                    <Text className="text-xl font-semibold text-textSecondary mt-4">
                        {error || "User not found"}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-primary px-6 py-3 rounded-full mt-6"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-background h-full">
            <ProfileHeader
                name={user.fullName}
                email={user.email}
                avatar={user.profilePicUrl || "https://i.pravatar.cc/150"}
                university={user.universityName}
                showBackButton
            />

            <View className="flex-row gap-3 px-5 mt-6">
                <StatCard label="Active Listings" value={activeListings.length} />
                <StatCard label="Sold Items" value={soldListings.length} />
            </View>

            <View className="mt-6 flex-1">
                <TabSelector
                    tabs={["Active Listings", "Sold Items"]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {displayListings.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-5">
                        <MaterialIcons name="inventory-2" size={64} color="#CDD5E0" />
                        <Text className="text-xl font-semibold text-textSecondary mt-4">
                            {activeTab === 0 ? "No Active Listings" : "No Sold Items"}
                        </Text>
                        <Text className="text-base text-textSecondary text-center mt-2">
                            {activeTab === 0
                                ? "This user has no active listings"
                                : "This user hasn't sold any items yet"}
                        </Text>
                    </View>
                ) : (
                    <View className="flex-1 px-5 mt-4">
                        <FlatList
                            data={displayListings}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleListingPress(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <MyListingCard
                                        id={String(item.id)}
                                        title={item.title}
                                        price={item.price}
                                        images={item.images}
                                        isSold={item.status === "SOLD"}
                                        hideMenu
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => String(item.id)}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default UserProfile;

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
    const { userId, name, email, university, avatar } = useLocalSearchParams<{ 
        userId: string;
        name?: string;
        email?: string;
        university?: string;
        avatar?: string;
    }>();
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
            // Try to fetch user data from API
            let userData: User | null = null;
            try {
                userData = await authService.getUserById(Number(userId));
            } catch (userError) {
                console.log("User API failed, using params:", userError);
                // If API fails, use data from query params
                if (name) {
                    userData = {
                        id: Number(userId),
                        fullName: name,
                        email: email || '',
                        universityName: university || '',
                        profilePicUrl: avatar || '',
                        phoneNumber: '',
                        universityId: 0,
                        createdAt: '',
                        isActive: true,
                    };
                }
            }

            // Fetch user listings
            const userListings = await productService.getUserListings(Number(userId));

            if (userData) {
                setUser(userData);
            } else if (!name) {
                // No user data from API and no params - show error
                setError("User not found");
                setIsLoading(false);
                return;
            }
            
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
            let errorMessage = "Failed to load profile";
            
            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message && typeof err.message === 'string') {
                errorMessage = err.message;
            } else if (err?.error && typeof err.error === 'string') {
                errorMessage = err.error;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [userId, name, email, university, avatar]);

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
            {/* Header with back button */}
            <View className="px-5 border-b border-b-borderPrimary pb-4">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">Profile</Text>
                    <TouchableOpacity
                        className="absolute left-0"
                        onPress={() => router.back()}
                        activeOpacity={0.5}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                    </TouchableOpacity>
                </View>
            </View>

            <ProfileHeader
                name={user.fullName}
                avatar={user.profilePicUrl}
                university={user.universityName}
                hideEmail
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
                                <MyListingCard
                                    id={String(item.id)}
                                    title={item.title}
                                    price={item.price}
                                    images={item.images}
                                    isSold={item.status === "SOLD"}
                                    hideMenu
                                />
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

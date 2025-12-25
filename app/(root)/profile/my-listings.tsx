import { productService } from "@/api/services/product";
import MyListingCard from "@/components/profile/MyListingCard";
import TabSelector from "@/components/profile/TabSelector";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyListings = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const { deleteProduct } = useProductStore();
    const [activeTab, setActiveTab] = useState(0);
    const [listings, setListings] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyListings = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await productService.getUserListings(user.id);
            setListings(data);
        } catch (err: any) {
            const errorMessage = typeof err === 'string' 
                ? err 
                : err?.message || err?.error || "Failed to load listings";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    // Refetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchMyListings();
        }, [fetchMyListings])
    );

    const activeListings = listings.filter(item => item.status !== "SOLD");
    const soldListings = listings.filter(item => item.status === "SOLD");
    const displayListings = activeTab === 0 ? activeListings : soldListings;

    const handleMenuPress = (id: number) => {
        Alert.alert(
            "Options",
            "Choose an action",
            [
                {
                    text: "Edit Listing",
                    onPress: () => router.push(`/upload?editId=${id}`),
                },
                {
                    text: "Delete Listing",
                    style: "destructive" as const,
                    onPress: () => handleDelete(id),
                },
                {
                    text: "Cancel",
                    style: "cancel" as const,
                },
            ]
        );
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            "Delete Listing",
            "Are you sure you want to delete this listing?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            await deleteProduct(id);
                            setListings(prev => prev.filter(item => item.id !== id));
                        } catch (err: any) {
                            const errorMessage = typeof err === 'string' 
                                ? err 
                                : err?.message || err?.error || "Could not delete listing";
                            Alert.alert("Error", errorMessage);
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#72C69B" />
                    <Text className="text-textSecondary mt-4">Loading listings...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center px-5">
                    <MaterialIcons name="error-outline" size={64} color="#CDD5E0" />
                    <Text className="text-xl font-semibold text-textSecondary mt-4">
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={fetchMyListings}
                        className="bg-primary px-6 py-3 rounded-full mt-6"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-background h-full">
            {/* Processing Overlay */}
            <Modal transparent visible={isProcessing} animationType="fade">
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="p-6 rounded-2xl items-center">
                        <ActivityIndicator size="large" color="#72C69B" />
                    </View>
                </View>
            </Modal>

            <View className="px-5 border-b border-b-borderPrimary pb-4">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">My Listings</Text>
                    <TouchableOpacity
                        className="absolute left-0"
                        onPress={() => router.back()}
                        activeOpacity={0.5}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                    </TouchableOpacity>
                </View>
            </View>

            <TabSelector
                tabs={["Active", "Sold"]}
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
                            ? "Start selling by listing your first item!"
                            : "Items you've sold will appear here"}
                    </Text>
                    {activeTab === 0 && (
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/upload")}
                            className="bg-primary px-6 py-3 rounded-full mt-6"
                            activeOpacity={0.7}
                        >
                            <Text className="text-white font-semibold text-base">
                                Create Listing
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View className="flex-1 px-5 mt-6">
                    <FlatList
                        data={displayListings}
                        renderItem={({ item }) => (
                            <MyListingCard
                                id={String(item.id)}
                                title={item.title}
                                price={item.price}
                                images={item.images}
                                isSold={item.status === "SOLD"}
                                onMenuPress={() => handleMenuPress(item.id)}
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
        </SafeAreaView>
    );
};

export default MyListings;
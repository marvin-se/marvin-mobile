import { productService } from "@/api/services/product";
import HistoryItem from "@/components/profile/HistoryItem";
import TabSelector from "@/components/profile/TabSelector";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HistoryItemData {
    id: string;
    title: string;
    price: number;
    image: string;
    otherUserName: string;
    date: string;
}

const History = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [soldItems, setSoldItems] = useState<HistoryItemData[]>([]);
    const [purchasedItems, setPurchasedItems] = useState<HistoryItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [salesResponse, purchasesResponse] = await Promise.all([
                productService.getSalesHistory(),
                productService.getPurchasesHistory(),
            ]);
            
            const salesData = Array.isArray(salesResponse) 
                ? salesResponse 
                : ((salesResponse as any)?.transactions || []);
            const purchasesData = Array.isArray(purchasesResponse) 
                ? purchasesResponse 
                : ((purchasesResponse as any)?.transactions || []);

            // Sales: Satılan ürünler - buyer bilgisini göster
            const mappedSoldItems: HistoryItemData[] = salesData.map((item: any) => ({
                id: String(item.id),
                title: item.product?.title || 'Unknown Item',
                price: item.product?.price || 0,
                image: item.product?.images?.[0] || 'https://picsum.photos/300/400',
                otherUserName: item.buyer?.fullName || 'Unknown Buyer',
                date: item.createdAt || new Date().toISOString(),
            }));

            // Purchases: Satın alınan ürünler - seller bilgisini göster
            const mappedPurchasedItems: HistoryItemData[] = purchasesData.map((item: any) => ({
                id: String(item.id),
                title: item.product?.title || 'Unknown Item',
                price: item.product?.price || 0,
                image: item.product?.images?.[0] || 'https://picsum.photos/300/400',
                otherUserName: item.seller?.fullName || 'Unknown Seller',
                date: item.createdAt || new Date().toISOString(),
            }));

            setSoldItems(mappedSoldItems);
            setPurchasedItems(mappedPurchasedItems);
        } catch (err: any) {
            const errorMessage = typeof err === 'string'
                ? err
                : err?.message || "Failed to load history";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [fetchHistory])
    );

    const displayItems = activeTab === 0 ? soldItems : purchasedItems;

    if (isLoading) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#72C69B" />
                    <Text className="text-textSecondary mt-4">Loading history...</Text>
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
                        onPress={fetchHistory}
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
            <View className="px-5 border-b border-b-borderPrimary pb-4">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">Transaction History</Text>
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
                tabs={["Sold", "Purchased"]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {displayItems.length === 0 ? (
                <View className="flex-1 items-center justify-center px-5">
                    <MaterialIcons name="receipt-long" size={64} color="#CDD5E0" />
                    <Text className="text-xl font-semibold text-textSecondary mt-4">
                        {activeTab === 0 ? "No Sold Items" : "No Purchases"}
                    </Text>
                    <Text className="text-base text-textSecondary text-center mt-2">
                        {activeTab === 0
                            ? "Items you sell will appear here"
                            : "Items you purchase will appear here"}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
                >
                    {displayItems.map((item, index) => (
                        <HistoryItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            price={item.price}
                            image={item.image}
                            otherUser={activeTab === 0 ? `Sold to ${item.otherUserName}` : `Bought from ${item.otherUserName}`}
                            date={item.date}
                            showBorder={index !== displayItems.length - 1}
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default History;
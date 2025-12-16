import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import TabSelector from "@/components/profile/TabSelector";
import HistoryItem from "@/components/profile/HistoryItem";

const History = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const soldItems = [
        {
            id: '1',
            title: 'Wireless Headphones',
            price: 120,
            image: 'https://picsum.photos/id/367/300/400',
            buyer: 'Sarah Johnson',
            date: '2025-12-10T14:30:00',
        },
        {
            id: '2',
            title: 'Winter Jacket',
            price: 95,
            image: 'https://picsum.photos/id/835/300/400',
            buyer: 'Michael Chen',
            date: '2025-12-08T10:15:00',
        },
        {
            id: '3',
            title: 'iPhone 13 Pro',
            price: 650,
            image: 'https://picsum.photos/id/160/300/400',
            buyer: 'Emma Davis',
            date: '2025-12-05T16:45:00',
        },
        {
            id: '4',
            title: 'Study Lamp',
            price: 25,
            image: 'https://picsum.photos/id/225/300/400',
            buyer: 'Alex Martinez',
            date: '2025-12-03T09:20:00',
        },
    ];

    const purchasedItems = [
        {
            id: '5',
            title: 'Calculus Textbook',
            price: 85,
            image: 'https://picsum.photos/id/24/300/400',
            seller: 'Jessica Brown',
            date: '2025-12-12T11:00:00',
        },
        {
            id: '6',
            title: 'Gaming Laptop',
            price: 850,
            image: 'https://picsum.photos/id/0/300/400',
            seller: 'David Kim',
            date: '2025-12-09T15:30:00',
        },
        {
            id: '7',
            title: 'Desk Chair',
            price: 65,
            image: 'https://picsum.photos/id/431/300/400',
            seller: 'Rachel Green',
            date: '2025-12-07T13:45:00',
        },
        {
            id: '8',
            title: 'Mini Fridge',
            price: 80,
            image: 'https://picsum.photos/id/452/300/400',
            seller: 'Tom Wilson',
            date: '2025-12-04T10:00:00',
        },
        {
            id: '9',
            title: 'Mountain Bike',
            price: 280,
            image: 'https://picsum.photos/id/146/300/400',
            seller: 'Anna Scott',
            date: '2025-12-01T12:30:00',
        },
    ];

    const displayItems = activeTab === 0 ? soldItems : purchasedItems;

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
                            otherUser={activeTab === 0 ? `Sold to ${item.buyer}` : `Bought from ${item.seller}`}
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
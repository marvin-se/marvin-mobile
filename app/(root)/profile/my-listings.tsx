import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import TabSelector from "@/components/profile/TabSelector";
import MyListingCard from "@/components/profile/MyListingCard";

const MyListings = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const myListings = [
        {
            id: '1',
            title: 'Calculus: Early Transcendentals',
            price: 85,
            image: 'https://picsum.photos/id/24/300/400',
            isSold: false,
        },
        {
            id: '2',
            title: 'Gaming Laptop - RTX 3060',
            price: 850,
            image: 'https://picsum.photos/id/0/300/400',
            isSold: false,
        },
        {
            id: '3',
            title: 'Wireless Headphones',
            price: 120,
            image: 'https://picsum.photos/id/367/300/400',
            isSold: true,
        },
        {
            id: '4',
            title: 'Winter Jacket',
            price: 95,
            image: 'https://picsum.photos/id/835/300/400',
            isSold: true,
        },
        {
            id: '5',
            title: 'Study Desk',
            price: 65,
            image: 'https://picsum.photos/id/431/300/400',
            isSold: false,
        },
        {
            id: '6',
            title: 'iPhone 13 Pro',
            price: 650,
            image: 'https://picsum.photos/id/160/300/400',
            isSold: true,
        },
    ];

    const activeListings = myListings.filter(item => !item.isSold);
    const soldListings = myListings.filter(item => item.isSold);
    const displayListings = activeTab === 0 ? activeListings : soldListings;

    const handleMenuPress = (id: string) => {
        Alert.alert(
            "Options",
            "Choose an action",
            [
                {
                    text: "Edit Listing",
                    onPress: () => console.log("Edit:", id),
                },
                {
                    text: "Mark as Sold",
                    onPress: () => console.log("Mark as sold:", id),
                },
                {
                    text: "Delete Listing",
                    style: "destructive",
                    onPress: () => console.log("Delete:", id),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    return (
        <SafeAreaView className="bg-background h-full">
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
                                id={item.id}
                                title={item.title}
                                price={item.price}
                                image={item.image}
                                isSold={item.isSold}
                                onMenuPress={() => handleMenuPress(item.id)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
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
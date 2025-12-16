import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useProductStore } from "@/store/useProductStore";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const Details = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const products = useProductStore((state) => state.products);
    const toggleFavorite = useProductStore((state) => state.toggleFavorite);

    const product = products.find((p) => p.id === id);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const productDetails = {
        description:
            "This item is in excellent condition and has been well-maintained. Perfect for students looking for quality products at affordable prices. Don't miss this opportunity!",
        condition: "Like New",
        location: "Harvard Campus - Building C",
        postedDate: "2025-12-10T14:30:00",
        views: 156,
        images: [
            product?.image || "https://picsum.photos/id/0/400/400",
            "https://picsum.photos/id/1/400/400",
            "https://picsum.photos/id/2/400/400",
        ],
        sellerRating: 4.8,
        sellerSales: 24,
        sellerAvatar: "https://i.pravatar.cc/150?img=33",
    };

    if (!product) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <MaterialIcons name="error-outline" size={64} color="#CDD5E0" />
                    <Text className="text-xl font-semibold text-textSecondary mt-4">
                        Product Not Found
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

    const handleFavoriteToggle = () => {
        toggleFavorite(product.id);
        Toast.show({
            type: "success",
            text1: product.isFavorite ? "Removed from Favorites" : "Added to Favorites",
            visibilityTime: 2000,
        });
    };

    const handleContactSeller = () => {
        router.push(`/chats/1`); // Mock chat id
    };

    const handleMakeOffer = () => {
        Alert.alert(
            "Make an Offer",
            "This feature will allow you to negotiate the price with the seller.",
            [{ text: "OK" }]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="relative">
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.floor(
                                event.nativeEvent.contentOffset.x / width
                            );
                            setSelectedImageIndex(index);
                        }}
                    >
                        {productDetails.images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={{ width, height: width }}
                                contentFit="cover"
                            />
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-4 left-4 bg-white/90 p-2 rounded-full"
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#2C3E50" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleFavoriteToggle}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={product.isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={product.isFavorite ? "red" : "#2C3E50"}
                        />
                    </TouchableOpacity>

                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                        {productDetails.images.map((_, index) => (
                            <View
                                key={index}
                                className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? "bg-white" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </View>
                </View>

                <View className="bg-white px-5 py-4">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-4">
                            <Text className="text-2xl font-bold text-textPrimary">
                                {product.title}
                            </Text>
                            <Text className="text-sm text-textSecondary mt-1 capitalize">
                                {product.category}
                            </Text>
                        </View>
                        <Text className="text-3xl font-bold text-primary">
                            ${product.price}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-4 mt-4 pt-4 border-t border-borderPrimary">
                        <View className="flex-row items-center gap-1">
                            <MaterialIcons name="location-on" size={16} color="#7F8C8D" />
                            <Text className="text-sm text-textSecondary">
                                {productDetails.location}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <MaterialIcons name="visibility" size={16} color="#7F8C8D" />
                            <Text className="text-sm text-textSecondary">
                                {productDetails.views} views
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white px-5 py-4 mt-2">
                    <Text className="text-base font-semibold text-textPrimary mb-2">
                        Description
                    </Text>
                    <Text className="text-base text-textSecondary leading-6">
                        {productDetails.description}
                    </Text>
                </View>

                <View className="bg-white px-5 py-4 mt-2">
                    <Text className="text-base font-semibold text-textPrimary mb-3">
                        Seller Information
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push(`/profile/${product.seller}`)}
                        className="flex-row items-center gap-3"
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: productDetails.sellerAvatar }}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                            contentFit="cover"
                        />
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-textPrimary">
                                {product.seller}
                            </Text>
                            <View className="flex-row items-center gap-2 mt-1">
                                <View className="flex-row items-center">
                                    <Ionicons name="star" size={14} color="#72C69B" />
                                    <Text className="text-sm text-textSecondary ml-1">
                                        {productDetails.sellerRating}
                                    </Text>
                                </View>
                                <Text className="text-sm text-textSecondary">•</Text>
                                <Text className="text-sm text-textSecondary">
                                    {productDetails.sellerSales} sales
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#7F8C8D" />
                    </TouchableOpacity>
                </View>

                <View className="px-5 py-3">
                    <Text className="text-xs text-textSecondary text-center">
                        Posted on {formatDate(productDetails.postedDate)}
                    </Text>
                </View>

                <View className="h-20" />
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-borderPrimary px-5 py-8">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handleMakeOffer}
                        className="flex-1 bg-white border-2 border-primary py-3 rounded-xl"
                        activeOpacity={0.7}
                    >
                        <Text className="text-primary text-center font-semibold text-base">
                            Make Offer
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleContactSeller}
                        className="flex-1 bg-primary py-3 rounded-xl"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            Contact Seller
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Details;
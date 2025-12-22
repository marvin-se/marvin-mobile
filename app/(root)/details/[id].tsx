import { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
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
    const { products, favoriteProducts, addFavoriteProduct, removeFavoriteProduct } = useProductStore();

    const product = products.find((p) => p.id === Number(id));
    const isFavorite = favoriteProducts.some(p => p.id === Number(id));

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showViews, setShowViews] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setShowViews(prev => !prev);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleFavoriteToggle = async () => {
        if (!product) return;

        const userId = product.sellerId;

        try {
            if (isFavorite) {
                await removeFavoriteProduct(userId, product.id);
                Toast.show({
                    type: "success",
                    text1: "Removed from Favorites",
                    visibilityTime: 2000,
                });
            } else {
                await addFavoriteProduct(userId, product.id);
                Toast.show({
                    type: "success",
                    text1: "Added to Favorites",
                    visibilityTime: 2000,
                });
            }
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: err.message || "Could not update favorites",
            });
        }
    };

    const handleContactSeller = () => {
        router.push(`/chats/${product?.sellerId}`);
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

    const images = product.images?.length ? product.images : ["https://picsum.photos/400/400"];

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
                        {images.map((img, index) => (
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
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "red" : "#2C3E50"}
                        />
                    </TouchableOpacity>

                    {images.length > 1 && (
                        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                        selectedImageIndex === index ? "bg-white" : "bg-white/50"
                                    }`}
                                />
                            ))}
                        </View>
                    )}
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
                                {product.universityName}
                            </Text>
                        </View>
                        
                        <Animated.View 
                            style={{ opacity: fadeAnim }}
                            className="flex-row items-center gap-1"
                        >
                            {showViews ? (
                                <>
                                    <MaterialIcons name="visibility" size={16} color="#7F8C8D" />
                                    <Text className="text-sm text-textSecondary">
                                        {product.visitCount ?? 0} views
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="heart" size={16} color="#7F8C8D" />
                                    <Text className="text-sm text-textSecondary">
                                        {product.favoriteCount ?? 0} likes
                                    </Text>
                                </>
                            )}
                        </Animated.View>
                    </View>
                </View>

                <View className="bg-white px-5 py-4 mt-2">
                    <Text className="text-base font-semibold text-textPrimary mb-2">
                        Description
                    </Text>
                    <Text className="text-base text-textSecondary leading-6">
                        {product.description}
                    </Text>
                </View>

                <View className="h-24" />
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-borderPrimary px-5 py-8">
                <TouchableOpacity
                    onPress={handleContactSeller}
                    className="bg-primary py-4 rounded-xl"
                    activeOpacity={0.7}
                >
                    <Text className="text-white text-center font-semibold text-base">
                        Contact Seller
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Details;
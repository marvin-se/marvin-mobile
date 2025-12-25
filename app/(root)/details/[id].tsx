import { productService } from "@/api/services/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const Details = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { products, favoriteProducts, addFavoriteProduct, removeFavoriteProduct, imageUrlCache, cacheImageUrls } = useProductStore();
    const { user } = useAuthStore();

    const product = products.find((p) => p.id === Number(id));
    const isFavorite = favoriteProducts.some(p => p.id === Number(id));
    const isOwnProduct = product?.sellerId === user?.id;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showViews, setShowViews] = useState(true);
    const [viewCount, setViewCount] = useState<number | null>(null);
    const [favouriteCount, setFavouriteCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const images = product?.images?.length ? product.images : ["https://picsum.photos/400/400"];
    const [displayImages, setDisplayImages] = useState<string[]>(images);

    useEffect(() => {
        const loadSignedImages = async () => {
            const productId = Number(id);
            if (product?.images && product.images.length > 0) {
                const firstImage = product.images[0];
                if (firstImage.startsWith('products/')) {
                    if (imageUrlCache[productId] && imageUrlCache[productId].length > 0) {
                        setDisplayImages(imageUrlCache[productId]);
                        return;
                    }

                    try {
                        const response = await productService.getProductImages(productId);
                        if (response.images && response.images.length > 0) {
                            const urls = response.images.map(img => img.url);
                            cacheImageUrls(productId, urls);
                            setDisplayImages(urls);
                        }
                    } catch (error) {
                        console.error("Failed to load images for product details", id, error);
                    }
                } else {
                    setDisplayImages(product.images);
                }
            }
        };

        if (product) {
            loadSignedImages();
        }
    }, [product, id, imageUrlCache]);

    useEffect(() => {
        const fetchProductStats = async () => {
            setIsLoading(true);
            try {
                const productId = Number(id);
                const updatedProduct = await productService.getProductById(productId);
                setViewCount(updatedProduct.visitCount ?? 0);
                setFavouriteCount(updatedProduct.favouriteCount ?? 0);
            } catch (error) {
                console.log("Stats fetch failed:", error);
                setViewCount(product?.visitCount ?? 0);
                setFavouriteCount(product?.favouriteCount ?? 0);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProductStats();
        }
    }, [id]);

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
        if (!product || isOwnProduct) return;

        try {
            if (isFavorite) {
                await removeFavoriteProduct(product.id);
            } else {
                await addFavoriteProduct(product.id);
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
        if (isOwnProduct) return;
        router.push(`/chats/${product?.sellerId}?productId=${product?.id}`);
    };

    // Loading state - full screen
    if (isLoading) {
        return (
            <SafeAreaView className="bg-background h-full">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#72C69B" />
                    <Text className="text-textSecondary mt-4">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                        {displayImages.map((img, index) => (
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

                    {!isOwnProduct && (
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
                    )}

                    {displayImages.length > 1 && (
                        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                            {displayImages.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? "bg-white" : "bg-white/50"
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
                                        {viewCount} views
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="heart" size={16} color="#7F8C8D" />
                                    <Text className="text-sm text-textSecondary">
                                        {favouriteCount} likes
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
                    className={`py-4 rounded-xl ${isOwnProduct ? "bg-gray-300" : "bg-primary"}`}
                    activeOpacity={isOwnProduct ? 1 : 0.7}
                    disabled={isOwnProduct}
                >
                    <Text className={`text-center font-semibold text-base ${isOwnProduct ? "text-gray-500" : "text-white"}`}>
                        {isOwnProduct ? "Your Listing" : "Contact Seller"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Details;
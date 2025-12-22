import { useProductStore } from '@/store/useProductStore';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    id: number;
    title: string;
    price: number;
    images: string[] | null;
    sellerId: number;
    isFavorite?: boolean;
    visitCount?: number | null;
    favoriteCount?: number | null;
}

const CURRENT_USER_ID = 1;

const ProductCard = ({ id, title, price, images, sellerId, isFavorite, visitCount, favoriteCount }: ProductCardProps) => {

    const { addFavoriteProduct, removeFavoriteProduct, fetchFavoriteProducts } = useProductStore();

    const handleProductPress = () => {
        router.push(`/details/${id}`);
    }

    const handleFavoriteToggle = (productId: number) => {
        if (isFavorite) {
            removeFavoriteProduct(productId);
        } else {
            addFavoriteProduct(productId);
        }
    }

    return (
        <TouchableOpacity
            onPress={handleProductPress}
            className='w-[48%] mb-4'
            activeOpacity={0.5}
        >
            <View className='relative'>
                <Image
                    source={{ uri: images ? images[0] : undefined }}
                    style={{ width: '100%', height: 200, borderRadius: 16 }}
                    contentFit='cover'
                />
                {sellerId !== CURRENT_USER_ID && (
                    <TouchableOpacity
                        onPress={() => handleFavoriteToggle(id)}
                        className='absolute top-3 right-3 bg-white/90 p-2 rounded-full z-50'
                        activeOpacity={0.5}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={20}
                            color={isFavorite ? 'red' : 'black'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View className="p-3">
                <Text
                    className="text-base font-semibold text-textPrimary mb-1"
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <View className="flex-row items-center mb-2">
                    <View className="flex-row items-center mr-3">
                        <Ionicons name="eye-outline" size={14} color="#6B7280" />
                        <Text className="text-xs text-textSecondary ml-1">
                            {visitCount ?? 0}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="heart-outline" size={14} color="#6B7280" />
                        <Text className="text-xs text-textSecondary ml-1">
                            {favoriteCount ?? 0}
                        </Text>
                    </View>
                </View>
                <Text className="text-lg font-bold text-primary">
                    ${price}
                </Text>
            </View>
        </TouchableOpacity >
    )
}

export default ProductCard
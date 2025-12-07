import { useProductStore } from '@/store/useProductStore';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    seller: string;
    isFavorite?: boolean;
}

const ProductCard = ({ id, title, price, image, seller, isFavorite }: ProductCardProps) => {
    const toggleFavorite = useProductStore((state) => state.toggleFavorite);

    const handleFavoriteToggle = () => {
        toggleFavorite(id);
    }

    const handleProductPress = () => {
        router.push(`/details/${id}`);
    }

    return (
        <TouchableOpacity
            onPress={handleProductPress}
            className='w-[48%] mb-4'
            activeOpacity={0.5}
        >
            <View className='relative'>
                <Image
                    source={{ uri: image }}
                    style={{ width: '100%', height: 200, borderRadius: 16 }}
                    contentFit='cover'
                />
                <TouchableOpacity
                    onPress={handleFavoriteToggle}
                    className='absolute top-3 right-3 bg-white/90 p-2 rounded-full z-50'
                    activeOpacity={0.5}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFavorite ? 'red' : 'black'}
                    />
                </TouchableOpacity>
            </View>

            <View className="p-3">
                <Text
                    className="text-base font-semibold text-textPrimary mb-1"
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text className="text-lg font-bold text-primary mb-1">
                    ${price}
                </Text>
                <Text className="text-sm text-textSecondary" numberOfLines={1}>
                    Sold by {seller}
                </Text>
            </View>
        </TouchableOpacity >
    )
}

export default ProductCard
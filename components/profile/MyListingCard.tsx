import { productService } from '@/api/services/product';
import { useProductStore } from '@/store/useProductStore';
import { Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MyListingCardProps {
    id: string;
    title: string;
    price: number;
    images: string[] | null;
    isSold?: boolean;
    onMenuPress?: () => void;
    hideMenu?: boolean;
}

const MyListingCard = ({ id, title, price, images, isSold = false, onMenuPress, hideMenu = false }: MyListingCardProps) => {
    const productId = Number(id);
    const { imageUrlCache, cacheImageUrls } = useProductStore();
    const [displayImage, setDisplayImage] = React.useState<string | undefined>(
        images ? images[0] : undefined
    );

    React.useEffect(() => {
        const loadSignedImage = async () => {
            if (images && images.length > 0) {
                const firstImage = images[0];
                if (firstImage.startsWith('products/')) {
                    if (imageUrlCache[productId] && imageUrlCache[productId].length > 0) {
                        setDisplayImage(imageUrlCache[productId][0]);
                        return;
                    }

                    try {
                        const response = await productService.getProductImages(productId);
                        if (response.images && response.images.length > 0) {
                            const urls = response.images.map(img => img.url);
                            cacheImageUrls(productId, urls);
                            setDisplayImage(urls[0]);
                        }
                    } catch (error) {
                        console.error("Failed to load image for listing", productId, error);
                    }
                } else {
                    setDisplayImage(firstImage);
                }
            } else {
                setDisplayImage(undefined);
            }
        };

        loadSignedImage();
    }, [images, productId, imageUrlCache]);
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
                    source={{ uri: displayImage || 'https://picsum.photos/300/400' }}
                    style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 16,
                        opacity: isSold ? 0.6 : 1
                    }}
                    contentFit='cover'
                />

                {!hideMenu && onMenuPress && (
                    <TouchableOpacity
                        onPress={onMenuPress}
                        className='absolute top-3 right-3 bg-white/90 p-2 rounded-full z-50'
                        activeOpacity={0.5}
                    >
                        <Entypo name="dots-three-vertical" size={16} color="black" />
                    </TouchableOpacity>
                )}

                {isSold && (
                    <View className='absolute top-3 left-3 bg-secondary px-3 py-1 rounded-full'>
                        <Text className='text-white text-xs font-bold'>SOLD</Text>
                    </View>
                )}
            </View>

            <View className="p-3">
                <Text
                    className={`text-base font-semibold mb-1 ${isSold ? 'text-textSecondary' : 'text-textPrimary'
                        }`}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text className={`text-lg font-bold mb-1 ${isSold ? 'text-textSecondary' : 'text-primary'
                    }`}>
                    ${price}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default MyListingCard;
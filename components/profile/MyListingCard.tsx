import { Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface MyListingCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    isSold?: boolean;
    onMenuPress?: () => void;
}

const MyListingCard = ({ id, title, price, image, isSold = false, onMenuPress }: MyListingCardProps) => {
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
                    style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 16,
                        opacity: isSold ? 0.6 : 1
                    }}
                    contentFit='cover'
                />

                <TouchableOpacity
                    onPress={onMenuPress}
                    className='absolute top-3 right-3 bg-white/90 p-2 rounded-full z-50'
                    activeOpacity={0.5}
                >
                    <Entypo name="dots-three-vertical" size={16} color="black" />
                </TouchableOpacity>

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
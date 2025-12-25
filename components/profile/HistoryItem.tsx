import { formatTimeAgo } from '@/utils/formatTime';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

interface HistoryItemProps {
    id: string;
    title: string;
    price: number;
    image: string;
    otherUser: string;
    date: string;
    showBorder?: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
    id,
    title,
    price,
    image,
    otherUser,
    date,
    showBorder = true,
}) => {
    return (
        <View
            className={`flex-row items-center gap-4 py-4 ${showBorder ? 'border-b border-borderPrimary' : ''
                }`}
        >
            <Image
                source={{ uri: image }}
                style={{ width: 80, height: 80, borderRadius: 12 }}
                contentFit='cover'
            />

            <View className='flex-1'>
                <Text className='text-base font-semibold text-textPrimary' numberOfLines={1}>
                    {title}
                </Text>
                <Text className='text-lg font-bold text-primary mt-1'>
                    ${price}
                </Text>
                <Text className='text-sm text-textSecondary mt-1' numberOfLines={1}>
                    {otherUser}
                </Text>
                <Text className='text-xs text-textSecondary mt-1'>
                    {formatTimeAgo(date)}
                </Text>
            </View>
        </View>
    );
};

export default HistoryItem;
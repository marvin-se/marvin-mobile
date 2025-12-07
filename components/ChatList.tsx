import { Entypo } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import mockMessages from '@/data/mockMessages'
import { formatTimeAgo } from '@/utils/formatTime'

const ChatList = () => {
    const params = useLocalSearchParams<{ query?: string }>();

    const filteredChats = useMemo(() => {
        if (!params.query || params.query.trim() === '') {
            return mockMessages;
        }

        const searchQuery = params.query.toLowerCase();
        return mockMessages.filter(chat =>
            chat.userName.toLowerCase().includes(searchQuery) ||
            chat.lastMessage.toLowerCase().includes(searchQuery)
        );
    }, [params.query]);

    return (
        <View className='px-5 flex-1'>
            {filteredChats.length === 0 ? (
                <View className='flex-1 items-center justify-center'>
                    <Text className='text-textSecondary text-lg'>No chats found</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 48 }}
                >
                    {filteredChats.map((chat, index) => (
                        <TouchableOpacity key={index} onPress={() => router.navigate(`/chats/${chat.id}`)} activeOpacity={0.3}>
                            <View className={`py-5 flex-row justify-between items-center gap-3 ${index !== filteredChats.length - 1 ? 'border-b border-b-borderPrimary' : ''}`}>
                                <View className='flex-row items-center gap-4 flex-1'>
                                    <Image
                                        source={{ uri: chat.userAvatar }}
                                        style={{ width: 48, height: 48, borderRadius: 9999 }}
                                        contentFit='cover'
                                    />
                                    <View className='flex-1'>
                                        <Text className='text-textPrimary font-bold text-lg' numberOfLines={1}>
                                            {chat.userName}
                                        </Text>
                                        <Text className={`${chat.unread > 0 ? 'font-bold text-textPrimary' : 'text-textSecondary'}`} numberOfLines={1}>
                                            {chat.lastMessage}
                                        </Text>
                                    </View>
                                </View>

                                <View className='items-end'>
                                    <Text className='text-textSecondary text-sm'>{formatTimeAgo(chat.timestamp)}</Text>
                                    {chat.unread > 0 && (<Entypo name="dot-single" size={32} color="#72c69b" className='-mr-3' />)}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

export default ChatList
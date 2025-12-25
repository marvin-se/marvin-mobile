import { Entypo } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Conversation } from '@/types/api'
import { getAvatarUrl } from '@/utils/avatar'
import { formatTimeAgo } from '@/utils/formatTime'

interface ChatListProps {
    conversations: Conversation[];
}

const ChatList = ({ conversations }: ChatListProps) => {
    const params = useLocalSearchParams<{ query?: string }>();

    const filteredChats = useMemo(() => {
        if (!params.query || params.query.trim() === '') {
            return conversations;
        }

        const searchQuery = params.query.toLowerCase();
        return conversations.filter(chat =>
            chat.username.toLowerCase().includes(searchQuery) ||
            chat.lastMessage?.content.toLowerCase().includes(searchQuery)
        );
    }, [params.query, conversations]);

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
                        <TouchableOpacity key={chat.id} onPress={() => router.navigate(`/chats/${chat.userId}?productId=${chat.product?.id}`)} activeOpacity={0.3}>
                            <View className={`py-5 flex-row justify-between items-center gap-3 ${index !== filteredChats.length - 1 ? 'border-b border-b-borderPrimary' : ''}`}>
                                <View className='flex-row items-center gap-4 flex-1'>
                                    <Image
                                        source={{ uri: getAvatarUrl(chat.username) }}
                                        style={{ width: 48, height: 48, borderRadius: 9999 }}
                                        contentFit='cover'
                                    />
                                    <View className='flex-1'>
                                        <Text className='text-textPrimary font-bold text-lg' numberOfLines={1}>
                                            {chat.username}
                                        </Text>
                                        <Text className={`${chat.lastMessage && !chat.lastMessage.read ? 'font-bold text-textPrimary' : 'text-textSecondary'}`} numberOfLines={1}>
                                            {chat.lastMessage?.content || 'No messages yet'}
                                        </Text>
                                    </View>
                                </View>

                                <View className='items-end'>
                                    <Text className='text-textSecondary text-sm'>
                                        {chat.lastMessage ? formatTimeAgo(chat.lastMessage.sentAt) : ''}
                                    </Text>
                                    {chat.lastMessage && !chat.lastMessage.read && (
                                        <Entypo name="dot-single" size={32} color="#72c69b" className='-mr-3' />
                                    )}
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
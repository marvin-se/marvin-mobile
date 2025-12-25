import { Entypo } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Conversation } from '@/types/api'
import { getAvatarUrl } from '@/utils/avatar'
import { formatTimeAgo } from '@/utils/formatTime'

interface ChatListProps {
    conversations: Conversation[];
    refreshing: boolean;
    onRefresh: () => void;
}

const ChatList = ({ conversations, refreshing, onRefresh }: ChatListProps) => {
    const params = useLocalSearchParams<{ query?: string }>();

    const filteredChats = useMemo(() => {
        let chats = conversations;

        // 1. Filter out empty conversations (no lastMessage)
        chats = chats.filter(chat => chat.lastMessage !== null && chat.lastMessage !== undefined);

        // 2. Filter by search query if present
        if (params.query && params.query.trim() !== '') {
            const searchQuery = params.query.toLowerCase();
            chats = chats.filter(chat =>
                chat.username.toLowerCase().includes(searchQuery) ||
                chat.lastMessage?.content.toLowerCase().includes(searchQuery)
            );
        }

        return chats;
    }, [params.query, conversations]);

    return (
        <View className='px-5 flex-1'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredChats.length === 0 ? (
                    <View className='flex-1 items-center justify-center'>
                        <Text className='text-textSecondary text-lg'>No chats found</Text>
                    </View>
                ) : (
                    filteredChats.map((chat, index) => (
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
                    ))
                )}
            </ScrollView>
        </View>
    )
}

export default ChatList
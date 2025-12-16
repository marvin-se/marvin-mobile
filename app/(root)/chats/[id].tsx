import { getChatById } from '@/data/mockChats'
import { getMessageById } from '@/data/mockMessages'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Chats = () => {

    const { id } = useLocalSearchParams();

    const chat = getChatById(id as string);
    const message = getMessageById(id as string);

    return (
        <SafeAreaView className='bg-background h-full'>
            <KeyboardAvoidingView 
                className='flex-1'
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={4}
            >
                <View className='px-5 border-b border-b-borderPrimary pb-4 mb-5'>
                    <View className="flex flex-row items-center justify-center mt-5 relative">
                        <View className='flex-row items-center gap-4'>
                            <Image
                                source={{ uri: message?.userAvatar }}
                                style={{ width: 48, height: 48, borderRadius: 9999 }}
                                contentFit='cover'
                            />
                            <Text className='text-textPrimary font-bold text-lg' numberOfLines={1}>
                                {message?.userName}
                            </Text>
                        </View>


                        <TouchableOpacity className='absolute left-0' onPress={() => router.back()} activeOpacity={0.5}>
                            <MaterialIcons name="arrow-back" size={32} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity className='absolute right-0' onPress={() => { }} activeOpacity={0.5}>
                            <Entypo name="dots-three-vertical" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {chat && <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {chat.map((message, index) => (
                        <View key={index} className={`px-5 mb-3 ${message.isSentByMe ? 'items-end' : 'items-start'}`}>
                            <View className={`${message.isSentByMe ? 'bg-primary' : 'bg-borderPrimary'} rounded-lg p-3 max-w-[80%]`}>
                                <Text className={`${message.isSentByMe ? 'text-white' : 'text-textPrimary'}`}>{message.content}</Text>
                            </View>
                            <Text className='text-textSecondary text-xs mt-1'>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                    ))}
                </ScrollView>
                }


                <View className='border-t border-borderPrimary px-5 py-3 bg-white flex-row items-center gap-4'>
                    <TouchableOpacity onPress={() => { }} activeOpacity={0.5}>
                        <AntDesign name="plus-circle" size={20} color="#72C69B" />
                    </TouchableOpacity>
                    <View className='flex-1'>
                        <TextInput className='px-4 py-2.5 bg-background rounded-full text-textPrimary' placeholder="Type a message..."></TextInput>
                    </View>
                    <TouchableOpacity className='w-12 h-12 rounded-full bg-primary items-center justify-center' onPress={() => { }} activeOpacity={0.5}>
                        <MaterialIcons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Chats
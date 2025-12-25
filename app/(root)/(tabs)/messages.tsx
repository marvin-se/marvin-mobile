import { messagesService } from '@/api/services/messages'
import ChatList from '@/components/ChatList'
import Search from '@/components/Search'
import { Conversation } from '@/types/api'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

let cachedConversations: Conversation[] = []

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(cachedConversations)
  const [loading, setLoading] = useState(cachedConversations.length === 0)

  useFocusEffect(
    useCallback(() => {
      fetchConversations()
    }, [])
  )

  const fetchConversations = async () => {
    try {
      const response = await messagesService.getConversations()
      cachedConversations = response.conversations
      setConversations(response.conversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className='bg-background h-full'>
      <View className='px-5 pb-4 mb-5 border-b border-b-borderPrimary'>
        <View className="flex flex-row items-center justify-center mt-5">
          <Text className="text-2xl font-bold text-textPrimary">Messages</Text>
        </View>
      </View>

      <Search chats />

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large'/>
        </View>
      ) : (
        <ChatList conversations={conversations} />
      )}
    </SafeAreaView>
  )
}

export default Messages
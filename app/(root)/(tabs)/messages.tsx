import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '@/components/Search'
import ChatList from '@/components/ChatList'

const Messages = () => {
  return (
    <SafeAreaView className='bg-background h-full'>
      <View className='px-5 pb-4 mb-5 border-b border-b-borderPrimary'>
        <View className="flex flex-row items-center justify-center mt-5">
          <Text className="text-2xl font-bold text-textPrimary">Messages</Text>
        </View>
      </View>

      <Search chats />

      <ChatList />
    </SafeAreaView>
  )
}

export default Messages
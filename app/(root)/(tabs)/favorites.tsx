import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProductGrid from '@/components/ProductGrid'
import FavoritesGrid from '@/components/FavoritesGrid'

const Favorites = () => {
  return (
    <SafeAreaView className='bg-background h-full'>
      <View className='px-5'>
        <View className="flex flex-row items-center justify-center mt-5">
          <Text className="text-2xl font-bold text-textPrimary">Favorites</Text>
        </View>
      </View>
      <FavoritesGrid />
    </SafeAreaView>
  )
}

export default Favorites
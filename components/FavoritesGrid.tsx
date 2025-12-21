import { useProductStore } from '@/store/useProductStore'
import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import ProductCard from './ProductCard'

const FavoritesGrid = () => {

    const { favoriteProducts, fetchFavoriteProducts } = useProductStore();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFavoriteProducts();
        setRefreshing(false);
    }


    useEffect(() => {
        const fetchFavorites = async () => {
            await fetchFavoriteProducts();
        }
        fetchFavorites();
    }, [])

    return (
        <View className='px-5 flex-1 my-8'>
            <FlatList
                data={favoriteProducts}
                renderItem={({ item }) => (
                    <ProductCard
                        {...item}
                        isFavorite={true}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#2C3E50"
                    />
                }
            />
        </View>
    )
}

export default FavoritesGrid
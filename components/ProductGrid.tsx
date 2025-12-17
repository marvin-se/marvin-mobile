import { useProductStore } from '@/store/useProductStore';
import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import ProductCard from './ProductCard';

const ProductGrid = ({ isFavoritesPage = false, currentCategory = 'ALL' }: { isFavoritesPage?: boolean, currentCategory?: string }) => {
    const { products, isLoading, clearCache, filterProducts } = useProductStore();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        clearCache();
        await filterProducts({ category: currentCategory });
        setRefreshing(false);
    }

    return (
        <View className='px-5 flex-1 my-8'>
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductCard
                        {...item}
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

export default ProductGrid
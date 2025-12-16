import { useProductStore } from '@/store/useProductStore';
import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';

const ProductGrid = ({ isFavoritesPage = false, filter }: { isFavoritesPage?: boolean, filter?: string }) => {
    const { products, isLoading, error } = useProducts();

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
            />
        </View>
    )
}

export default ProductGrid
import { useProductStore } from '@/store/useProductStore';
import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from './ProductCard';

const ProductGrid = ({ isFavoritesPage = false, filter }: { isFavoritesPage?: boolean, filter?: string }) => {
    const products = useProductStore((state) => state.products);

    const data = useMemo(() => {
        return isFavoritesPage
            ? products.filter(p => p.isFavorite)
            : filter
                ? products.filter(p => p.category === filter)
                : products;
    }, [products, isFavoritesPage, filter]);

    return (
        <View className='px-5 flex-1 my-8'>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <ProductCard 
                        {...item}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}

export default ProductGrid
import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'

const mockProducts = [
    {
        id: '1',
        title: 'CHEM 101 Textbook',
        price: 45,
        image: 'https://picsum.photos/300/400?random=1',
        seller: 'Alex P.',
        isFavorite: false,
    },
    {
        id: '2',
        title: 'Ergonomic Desk Chair',
        price: 70,
        image: 'https://picsum.photos/300/400?random=2',
        seller: 'Sarah K.',
        isFavorite: true,
    },
    {
        id: '3',
        title: 'Bluetooth Speaker',
        price: 25,
        image: 'https://picsum.photos/300/400?random=3',
        seller: 'Mike T.',
        isFavorite: false,
    },
    {
        id: '4',
        title: "Men's Winter Jacket",
        price: 50,
        image: 'https://picsum.photos/300/400?random=4',
        seller: 'Emily R.',
        isFavorite: true,
    },
    {
        id: '5',
        title: 'CHEM 101 Textbook',
        price: 45,
        image: 'https://picsum.photos/300/400?random=1',
        seller: 'Alex P.',
        isFavorite: false,
    },
    {
        id: '6',
        title: 'Ergonomic Desk Chair',
        price: 70,
        image: 'https://picsum.photos/300/400?random=2',
        seller: 'Sarah K.',
        isFavorite: true,
    },
    {
        id: '7',
        title: 'Bluetooth Speaker',
        price: 25,
        image: 'https://picsum.photos/300/400?random=3',
        seller: 'Mike T.',
        isFavorite: false,
    },
    {
        id: '8',
        title: "Men's Winter Jacket",
        price: 50,
        image: 'https://picsum.photos/300/400?random=4',
        seller: 'Emily R.',
        isFavorite: true,
    },
]

const ProductGrid = () => {
    return (
        <View className='px-5 flex-1 mt-8'>
            <FlatList
                data={mockProducts}
                renderItem={({ item }) => <ProductCard {...item} />}
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
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const categories = [
    { id: 'all', label: 'All' },
    { id: 'textbooks', label: 'Textbooks' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'sports', label: 'Sports' },
]

const CategoryFilter = ({ selectedCategory, onCategoryChange }: { selectedCategory: string, onCategoryChange: (category: string) => void }) => {

    const handleCategoryPress = (categoryId: string) => {
        onCategoryChange(categoryId);
    }

    return (
        <View className='mt-5'>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='px-5'
                contentContainerStyle={{ gap: 10 }}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        onPress={() => handleCategoryPress(category.id)}
                        className={`px-6 py-3 rounded-full ${selectedCategory === category.id ? 'bg-primary' : 'bg-white'}`}
                        activeOpacity={0.5}
                    >
                        <Text
                            className={`font-semibold ${selectedCategory === category.id
                                ? 'text-white'
                                : 'text-textPrimary'
                                }`}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default CategoryFilter
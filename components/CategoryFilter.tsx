import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const categories = [
    { id: 'all', label: 'All' },
    { id: 'textbooks', label: 'Textbooks' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'sports', label: 'Sports' },
    { id: 'other', label: 'Other' },
]

const CategoryFilter = ({ onCategoryChange }: { onCategoryChange: (category: string) => void }) => {

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const handleCategoryPress = (categoryId: string) => {
        setSelectedCategory(categoryId);
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
                        className={`px-6 py-3 rounded-full ${selectedCategory === category.id ? 'bg-buttonBackground' : 'bg-white'}`}
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
import { categories } from '@/utils/constants'
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const CategoryFilter = ({ selectedCategory, onCategoryChange }: { selectedCategory: string, onCategoryChange: (category: string) => void }) => {

    const handleCategoryPress = (categoryVal: string) => {
        onCategoryChange(categoryVal);
    }

    const allCategories = useMemo(() => {
        return [{ label: 'All', value: 'ALL' }, ...categories]
    }, [])

    return (
        <View className='mt-5'>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='px-5'
                contentContainerStyle={{ gap: 10 }}
            >
                {allCategories.map((category) => (
                    <TouchableOpacity
                        key={category.value}
                        onPress={() => handleCategoryPress(category.value)}
                        className={`px-6 py-3 rounded-full ${selectedCategory === category.value ? 'bg-primary' : 'bg-white'}`}
                        activeOpacity={0.5}
                    >
                        <Text
                            className={`font-semibold ${selectedCategory === category.value
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
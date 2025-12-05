import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { useDebouncedCallback } from "use-debounce"

const Search = ({ chats }: { chats?: boolean }) => {

    const path = usePathname();
    const params = useLocalSearchParams<{ query?: string }>();
    const [search, setSearch] = useState(params.query)

    const debouncedSearch = useDebouncedCallback((text: string) =>
        router.setParams({ query: text }), 500);

    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text);
    }

    return (
        <View className='flex flex-row items-center justify-between w-full px-5 py-2 rounded-lg'>
            <View className='flex-1 flex flex-row items-center justify-start z-50 bg-white px-4 py-3.5 rounded-xl'>
                <Ionicons name="search" size={20} color="#7F8C8D" />
                <TextInput
                    value={search}
                    onChangeText={handleSearch}
                    placeholder={chats ? "Search chats..." : "Search for textbooks, furniture..."}
                    className="flex-1 px-2 ml-2 text-textPrimary placeholder:text-textSecondary"
                />
            </View>
        </View>
    )
}

export default Search
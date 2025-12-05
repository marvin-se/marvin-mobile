import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import Search from "@/components/Search";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  }

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="px-5 mb-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-2xl font-bold text-textPrimary">Campus Trade</Text>
          <View className="flex flex-row items-center gap-4">
            <AntDesign name="bell" size={24} color="#2C3E50" />
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="bg-gray-200 p-2 rounded-full"
              activeOpacity={0.5}
            >
              <MaterialCommunityIcons name="account-outline" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Search />
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <ProductGrid filter={selectedCategory === 'all' ? undefined : selectedCategory} />
    </SafeAreaView>

  );
}

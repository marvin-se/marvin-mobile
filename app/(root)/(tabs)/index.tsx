import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import Search from "@/components/Search";
import { useProductStore } from "@/store/useProductStore";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const { filterProducts, fetchProducts } = useProductStore();
  const { query } = useLocalSearchParams<{ query?: string }>();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchProducts();
  }, [])

  useEffect(() => {
    filterProducts({ category: selectedCategory, keyword: query });
  }, [query, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  }

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="px-5 mb-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-2xl font-bold text-textPrimary">Campus Trade</Text>
          <View className="flex flex-row items-center gap-4">
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
      <ProductGrid currentCategory={selectedCategory} />
    </SafeAreaView>

  );
}

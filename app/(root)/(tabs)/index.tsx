import CategoryFilter from "@/components/CategoryFilter";
import Search from "@/components/Search";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const handleCategoryChange = (category: string) => { }

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="px-5">
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
      <CategoryFilter onCategoryChange={handleCategoryChange} />
    </SafeAreaView>

  );
}

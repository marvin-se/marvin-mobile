import { authService } from "@/api/services/auth";
import { User } from "@/types/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BlockedUsers = () => {
    const router = useRouter();
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchBlockedUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const users = await authService.getBlockedUsers();
            setBlockedUsers(users);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch blocked users");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);

    const handleUnblock = async (userId: number) => {
        try {
            setActionLoading(userId);
            await authService.unblockUser(userId);
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert("Success", "User unblocked successfully");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to unblock user");
        } finally {
            setActionLoading(null);
        }
    };

    const renderItem = ({ item }: { item: User }) => (
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center flex-1">
                <Image
                    source={{ uri: item.profilePicUrl || "https://via.placeholder.com/50" }}
                    className="w-12 h-12 rounded-full mr-3 bg-gray-200"
                />
                <View className="flex-1">
                    <Text className="text-textPrimary font-semibold text-base" numberOfLines={1}>
                        {item.fullName}
                    </Text>
                    <Text className="text-textSecondary text-sm" numberOfLines={1}>
                        {item.universityName}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => handleUnblock(item.id)}
                disabled={actionLoading === item.id}
                className="bg-gray-100 px-4 py-2 rounded-full ml-3"
            >
                {actionLoading === item.id ? (
                    <ActivityIndicator size="small" color="#2C3E50" />
                ) : (
                    <Text className="text-textPrimary font-medium">Unblock</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="bg-background h-full">
            <View className="px-5 border-b border-b-borderPrimary pb-4">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">Blocked Users</Text>
                    <TouchableOpacity
                        className="absolute left-0"
                        onPress={() => router.back()}
                        activeOpacity={0.5}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#72C69B" />
                </View>
            ) : (
                <FlatList
                    data={blockedUsers}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center mt-20 px-5">
                            <MaterialIcons name="block" size={64} color="#CDD5E0" />
                            <Text className="text-xl font-semibold text-textSecondary mt-4">
                                No Blocked Users
                            </Text>
                            <Text className="text-base text-textSecondary text-center mt-2">
                                You haven't blocked any users yet.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default BlockedUsers;

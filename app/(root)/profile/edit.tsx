import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import InputField from "@/components/auth/InputField";
import Button from "@/components/auth/Button";

const EditProfile = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const email = "john.doe@university.edu"; // Read-only
    const [phone, setPhone] = useState("+1 (555) 123-4567");
    const [bio, setBio] = useState("Computer Science student. Love tech and books!");
    const university = "Harvard University"; // Read-only

    const [avatar] = useState("https://i.pravatar.cc/150?img=12");

    const handleSave = () => {
        Toast.show({
            type: "success",
            text1: "Profile Updated",
            text2: "Your profile has been successfully updated.",
        });
        router.back();
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="px-5 border-b border-b-borderPrimary pb-4 mb-5">
                    <View className="flex flex-row items-center justify-center mt-5 relative">
                        <Text className="text-2xl font-bold text-textPrimary">Edit Profile</Text>
                        <TouchableOpacity
                            className="absolute left-0"
                            onPress={() => router.back()}
                            activeOpacity={0.5}
                        >
                            <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="items-center mb-6">
                        <View className="relative">
                            <Image
                                source={{ uri: avatar }}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                                contentFit="cover"
                            />
                            <TouchableOpacity
                                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"
                                activeOpacity={0.5}
                            >
                                <MaterialIcons name="camera-alt" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-textSecondary mt-2">Tap to change photo</Text>
                    </View>

                    <View className="px-5">
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <InputField
                                    label="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View className="flex-1">
                                <InputField
                                    label="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[#182c53] text-base font-semibold ml-2 mb-2">
                                Email
                            </Text>
                            <View className="border border-gray-300 rounded-2xl bg-gray-100 px-4 py-3">
                                <Text className="text-gray-500">{email}</Text>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[#182c53] text-base font-semibold ml-2 mb-2">
                                University
                            </Text>
                            <View className="border border-gray-300 rounded-2xl bg-gray-100 px-4 py-3">
                                <Text className="text-gray-500">{university}</Text>
                            </View>
                        </View>

                        <InputField
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="numeric"
                        />

                        <View className="mb-4">
                            <Text className="text-[#182c53] text-base font-semibold ml-2 mb-2">
                                Bio
                            </Text>
                            <View className="border border-gray-300 rounded-2xl bg-white">
                                <TextInput
                                    value={bio}
                                    onChangeText={setBio}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    placeholder="Tell us about yourself..."
                                    placeholderTextColor="#9ca3af"
                                    className="px-4 py-3 text-gray-900 min-h-[120px]"
                                />
                            </View>
                        </View>

                        <Button title="Save Changes" onPress={handleSave} />

                        <View className="h-4" />

                        <Button
                            title="Cancel"
                            onPress={() => router.back()}
                            variant="secondary"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfile;
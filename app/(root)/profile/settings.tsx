import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ProfileSection from "@/components/profile/ProfileSection";
import SettingToggle from "@/components/profile/SettingsToggle";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";

const Settings = () => {
    const router = useRouter();

    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    
    const [showEmail, setShowEmail] = useState(false);
    const [showPhone, setShowPhone] = useState(false);

    return (
        <SafeAreaView className="bg-background h-full">
            <View className="px-5 border-b border-b-borderPrimary pb-4 mb-5">
                <View className="flex flex-row items-center justify-center mt-5 relative">
                    <Text className="text-2xl font-bold text-textPrimary">Settings</Text>
                    <TouchableOpacity
                        className="absolute left-0"
                        onPress={() => router.back()}
                        activeOpacity={0.5}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileSection title="Notifications">
                    <SettingToggle
                        icon="notifications"
                        title="Push Notifications"
                        description="Receive push notifications on your device"
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                    />
                    <SettingToggle
                        icon="email"
                        title="Email Notifications"
                        description="Receive notifications via email"
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                    />
                </ProfileSection>

                <ProfileSection title="Privacy">
                    <SettingToggle
                        icon="email"
                        title="Show Email"
                        description="Display your email on your profile"
                        value={showEmail}
                        onValueChange={setShowEmail}
                    />
                    <SettingToggle
                        icon="phone"
                        title="Show Phone Number"
                        description="Display your phone number on your profile"
                        value={showPhone}
                        onValueChange={setShowPhone}
                        showBorder={false}
                    />
                </ProfileSection>

                <ProfileSection title="Account">
                    <ProfileMenuItem
                        icon="lock"
                        title="Change Password"
                        onPress={() => router.push("/profile/change-password")}
                    />
                    <ProfileMenuItem
                        icon="delete"
                        title="Delete Account"
                        onPress={() => { }}
                        showBorder={false}
                        textColor="text-red-500"
                    />
                </ProfileSection>

                {/* App Section */}
                <ProfileSection title="App">
                    <ProfileMenuItem
                        icon="policy"
                        title="Privacy Policy"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon="description"
                        title="Terms of Service"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon="info"
                        title="App Version"
                        onPress={() => { }}
                        showBorder={false}
                    />
                </ProfileSection>

                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;
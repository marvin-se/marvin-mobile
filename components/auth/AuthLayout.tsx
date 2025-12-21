import React from "react";
import { View, ImageBackground, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";

interface AuthLayoutProps {
    children: React.ReactNode;
    showLogo?: boolean;
    scrollable?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    showLogo = true,
    scrollable = false
}) => {
    const content = (
        <ImageBackground
            source={require("../../assets/images/bg-browse.png")}
            resizeMode="cover"
            className="flex-1 justify-center px-8"
        >
            <View className="absolute inset-0 bg-[#fdf6e3]/30" />

            <View className="px-4">
                {showLogo && (
                    <Image
                        source={require("../../assets/images/logo.png")}
                        className="w-24 h-24 mx-auto mb-6"
                        resizeMode="contain"
                    />
                )}
                {children}
            </View>
        </ImageBackground>
    );

    if (scrollable) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View className="flex-1">
                    {content}
                </View>
            </KeyboardAvoidingView>
        );
    }

    return content;
};

export default AuthLayout;
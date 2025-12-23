import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import Toast, { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";
import { useAuthStore } from "@/store/useAuthStore";
import "./global.css";

const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: "#72c69b", height: 80 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#182c53",
            }}
            text2Style={{
                fontSize: 16,
                color: "#5a6778",
            }}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: "#e74c3c", height: 80 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#182c53",
            }}
            text2Style={{
                fontSize: 16,
                color: "#5a6778",
            }}
        />
    ),
    info: (props: any) => (
        <InfoToast
            {...props}
            style={{ borderLeftColor: "#182c53", height: 80 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#182c53",
            }}
            text2Style={{
                fontSize: 16,
                color: "#5a6778",
            }}
        />
    ),
};

function useProtectedRoute() {
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setIsReady(true);
        };
        init();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)/sign-in");
        } else if (isAuthenticated && inAuthGroup) {
            router.replace("/");
        }
    }, [isAuthenticated, segments, isReady]);

    return isReady;
}

export default function RootLayout() {
    const isReady = useProtectedRoute();

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fdf6e3" }}>
                <ActivityIndicator size="large" color="#72C69B" />
            </View>
        );
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast config={toastConfig} />
        </>
    );
}
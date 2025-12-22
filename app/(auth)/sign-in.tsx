import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AuthLayout from "@/components/auth/AuthLayout";
import FormTitle from "@/components/auth/FormTitle";
import InputField from "@/components/auth/InputField";
import Button from "@/components/auth/Button";
import LinkText from "@/components/auth/LinkText";
import { validateEmail } from "@/utils/validation";
import { authService } from "@/api/services/auth";
import { setToken } from "@/utils/storage";
import { useAuthStore } from "@/store/useAuthStore";

const SignIn = () => {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Please fill in both email and password.",
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: "error",
                text1: "Invalid Email",
                text2: "Please enter a valid email address.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.signIn({ email, password });
        
            if (response?.token) {
                await setToken(response.token);
            }

            if (response?.user) {
                setUser(response.user);
            }

            Toast.show({
                type: "success",
                text1: "Welcome!",
                text2: "You have successfully signed in.",
            });

            router.replace("/");
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Sign In Failed",
                text2: error.message || "Please check your credentials and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout showLogo>
            <FormTitle title={`Sign In to\nCampusTrade`} />

            <InputField
                label="University Email"
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
                placeholder="yourname@university.edu"
                keyboardType="email-address"
            />

            <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                showToggle
                onToggle={() => setShowPassword(!showPassword)}
            />

            <Button
                title="Forgot Password?"
                onPress={() => router.push("/(auth)/forgot-password")}
                variant="text"
                style="self-end mb-6"
            />

            <Button 
                title={isLoading ? "Signing In..." : "Sign In"} 
                onPress={handleSignIn}
                disabled={isLoading}
            />

            <View className="mt-8">
                <LinkText
                    text="Don't have an account?"
                    linkText="Sign Up"
                    onPress={() => router.push("/(auth)/sign-up")}
                />
            </View>
        </AuthLayout>
    );
};

export default SignIn;
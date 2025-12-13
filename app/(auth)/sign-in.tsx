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

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = () => {
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

        Toast.show({
            type: "success",
            text1: "Welcome!",
            text2: "You have successfully signed in.",
        });

        router.push("/");
    };

    return (
        <AuthLayout showLogo>
            <FormTitle title={`Sign In to\nCampusTrade`} />

            <InputField
                label="University Email"
                value={email}
                onChangeText={setEmail}
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

            <Button title="Sign In" onPress={handleSignIn} />

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

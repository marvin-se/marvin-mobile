import Button from "@/components/auth/Button";
import Header from "@/components/auth/Header";
import InputField from "@/components/auth/InputField";
import { validateEmail } from "@/utils/validation";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { authService } from "@/api/services/auth";

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Toast.show({
                type: "error",
                text1: "Email required",
                text2: "Please enter your university email.",
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
            await authService.forgotPassword({ email });

            Toast.show({
                type: "success",
                text1: "Email sent!",
                text2: "Check your inbox for the verification code.",
            });

            router.push({
                pathname: "/(auth)/verification/[verify]",
                params: { verify: "reset", email }
            });
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Request Failed",
                text2: error.message || "Could not send reset email. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#fdf6e3]/40 px-8 pt-20">
            <Header
                title="Forgot Password"
                information="Enter your university email to receive a password reset link."
            />

            <View className="flex-1 justify-between pb-10">
                <InputField
                    label="University Email"
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    placeholder="yourname@university.edu"
                    keyboardType="email-address"
                />

                <Button 
                    title={isLoading ? "Sending..." : "Send Reset Link"} 
                    onPress={handleReset}
                    disabled={isLoading}
                />
            </View>
        </View>
    );
};

export default ForgotPassword;

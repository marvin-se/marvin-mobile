import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Header from "@/components/auth/Header";
import Button from "@/components/auth/Button";
import CodeInput from "@/components/auth/CodeInput";
import { validateCode } from "@/utils/validation";

const Verification = () => {
    const router = useRouter();
    const { verify } = useLocalSearchParams();
    const isEmailVerification = verify === "email";

    const title = isEmailVerification ? "Verify Your Email" : "Password Reset Code";
    const subtitle = "Please enter the 6-digit code sent to your university email address.";

    const [code, setCode] = useState(["", "", "", "", "", ""]);

    const handleVerify = () => {
        if (!validateCode(code)) {
            Toast.show({
                type: "error",
                text1: "Invalid Code",
                text2: "Please enter all 6 digits.",
            });
            return;
        }

        Toast.show({
            type: "success",
            text1: "Verified!",
            text2: isEmailVerification
                ? "Your email has been verified."
                : "Your reset code is valid.",
        });

        setTimeout(() => {
            if (isEmailVerification) {
                router.push("/(auth)/sign-in");
            } else {
                router.push("/(auth)/reset-password");
            }
        }, 800);
    };

    const handleResend = () => {
        Toast.show({
            type: "success",
            text1: "Code Resent",
            text2: "A new verification code has been sent to your email.",
        });
    };

    return (
        <View className="flex-1 bg-[#fdf6e3]/60 px-8 pt-20">
            <Header title={title} information={subtitle} />

            <View className="flex-1 justify-between py-10">
                <CodeInput code={code} onCodeChange={setCode} />
            </View>

            <View>
                <Button title="Verify & Continue" onPress={handleVerify} />

                <View className="mt-6">
                    <Text className="text-center text-[#182c53] mb-4">
                        Didn't receive the email?{" "}
                        <Text onPress={handleResend} className="text-[#72c69b] font-semibold">
                            Resend Email
                        </Text>
                    </Text>
                    <Button
                        title="Back to Login"
                        onPress={() => router.push("/(auth)/sign-in")}
                        variant="text"
                    />
                </View>
            </View>
        </View>
    );
};

export default Verification;

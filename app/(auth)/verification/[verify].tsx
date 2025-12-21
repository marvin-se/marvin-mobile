import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Header from "@/components/auth/Header";
import Button from "@/components/auth/Button";
import CodeInput from "@/components/auth/CodeInput";
import { validateCode } from "@/utils/validation";
import { authService } from "@/api/services/auth";

const Verification = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{ verify: string; email: string }>();
    const isEmailVerification = params.verify === "email";

    const title = isEmailVerification ? "Verify Your Email" : "Password Reset Code";
    const subtitle = "Please enter the 6-digit code sent to your university email address.";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleVerify = async () => {
        if (!validateCode(code)) {
            Toast.show({
                type: "error",
                text1: "Invalid Code",
                text2: "Please enter all 6 digits.",
            });
            return;
        }

        setIsLoading(true);
        const codeString = code.join("");

        try {
            if (isEmailVerification) {
                await authService.verifyEmail({
                    email: params.email,
                    token: codeString
                });
            } else {
                await authService.verifyResetCode({
                    email: params.email,
                    token: codeString
                });
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
                    router.push({
                        pathname: "/(auth)/reset-password",
                        params: { code: codeString, email: params.email }
                    });
                }
            }, 800);
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Verification Failed",
                text2: error.message || "Invalid code. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);

        try {
            if (isEmailVerification) {
                await authService.resend({ email: params.email });
            } else {
                await authService.forgotPassword({ email: params.email })
            }

            Toast.show({
                type: "success",
                text1: "Code Resent",
                text2: "A new verification code has been sent to your email.",
            });
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Resend Failed",
                text2: error.message || "Could not resend code. Please try again.",
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View className="flex-1 bg-[#fdf6e3]/40 px-8 pt-20">
            <Header title={title} information={subtitle} />

            <View className="flex-1 justify-between py-10">
                <CodeInput code={code} onCodeChange={setCode} />
            </View>

            <View>
                <Button
                    title={isLoading ? "Verifying..." : "Verify & Continue"}
                    onPress={handleVerify}
                    disabled={isLoading}
                />

                <View className="mt-6">
                    <Text className="text-center text-[#182c53] mb-4">
                        Didn't receive the email?{" "}
                        <Text
                            onPress={isResending ? undefined : handleResend}
                            className={`font-semibold ${isResending ? "text-gray-400" : "text-[#72c69b]"}`}
                        >
                            {isResending ? "Sending..." : "Resend Email"}
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

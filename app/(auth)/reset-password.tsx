import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Header from "@/components/auth/Header";
import InputField from "@/components/auth/InputField";
import Button from "@/components/auth/Button";
import { validateStrongPassword, validatePasswordMatch, getPasswordErrorMessage } from "@/utils/validation";
import { authService } from "@/api";
import { RequestType } from "@/types/auth";

const ResetPassword = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{ code: string; email: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!validateStrongPassword(password)) {
            Toast.show({
                type: "error",
                text1: "Weak Password",
                text2: getPasswordErrorMessage(),
            });
            return;
        }

        if (!validatePasswordMatch(password, confirmPassword)) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Passwords do not match.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword({
                email: params.email,
                token: params.code,
                oldPassword: null,
                newPassword: password,
                confirmNewPassword: confirmPassword,
                type: RequestType.FORGOT_PASSWORD
            });

            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Password successfully reset.",
            });

            router.push("/(auth)/sign-in");
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Reset Failed",
                text2: error.message || "Could not reset password. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#fdf6e3]/40 px-8 pt-20">
            <Header title="Reset Password" information="Enter your new password" />

            <View className="px-4 mt-8">
                <InputField
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    showToggle
                    onToggle={() => setShowPassword(!showPassword)}
                />

                <InputField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    showToggle
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <Button
                    title={isLoading ? "Resetting..." : "Reset Password"}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                />
            </View>
        </View>
    );
};

export default ResetPassword;

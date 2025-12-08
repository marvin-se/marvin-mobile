import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const ResetPassword = () => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const strongPassword = (password:any) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        return passwordRegex.test(password);
    }

    const matchPassword = (password:any, confirmPassword:any) => {
        return password === confirmPassword;
    }

    const handlePassword = () => {
        if (!strongPassword(password)) {
            Toast.show({
                type: "error",
                text1: "Weak Password",
                text2: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
            });
            return;
        }

        if (!matchPassword(password, confirmPassword)) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password do not match."
            });
            return;
        }

        Toast.show({
            type: "success",
            text1: "Success",
            text2: "Password successfully reset."
        })

        router.push("/(auth)/sign-in");
    }

    return (
        <View className="flex-1 bg-[#fdf6e3]/60 px-8 pt-20">
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-12 left-6"
            >
                <Ionicons name="chevron-back" size={28} color="#182c53" />
            </TouchableOpacity>
            <View className="mt-20">
                <Text className="text-3xl font-extrabold text-center text-[#182c53]">
                    Reset Password
                </Text>
                <Text className="text-center text-[#5a6778] mt-3 text-base">
                    Enter your new password
                </Text>
            </View>
            <View className="px-4 mt-8">
                <View>
                    <Text className="text-[#182c53] text-base font-semibold ml-2">
                        Password
                    </Text>
                    <View className="flex-row items-center border border-gray-300 rounded-2xl bg-white my-2">
                        <TextInput
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            className="flex-1 px-4 py-2 text-gray-900"
                            style={{ fontFamily: "monospace" }}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="px-4"
                        >
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text className="text-[#182c53] text-base font-semibold ml-2">
                        Confirm Password
                    </Text>

                    <View className="flex-row items-center border border-gray-300 rounded-2xl bg-white my-2">
                        <TextInput
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            className="flex-1 px-4 py-2 text-gray-900"
                            style={{ fontFamily: "monospace" }}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="px-4"
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="bg-[#72c69b] rounded-2xl py-4 mt-8">
                        <TouchableOpacity onPress={handlePassword}>
                            <Text className="text-white text-center text-lg font-semibold">
                                Reset Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    ); 
}

export default ResetPassword;

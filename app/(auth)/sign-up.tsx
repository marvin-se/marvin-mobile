import { authService } from "@/api/services/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/auth/Button";
import FormTitle from "@/components/auth/FormTitle";
import InputField from "@/components/auth/InputField";
import LinkText from "@/components/auth/LinkText";
import UniversityPicker from "@/components/auth/UniversityPicker";
import { getPasswordErrorMessage, validateEmail, validatePasswordMatch, validateStrongPassword } from "@/utils/validation";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const SignUp = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [university, setUniversity] = useState<string | null>(null);
    const [items, setItems] = useState<{ label: string; value: string }[]>([]);
    const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await authService.getUniversities();
                // Response: [{ name: "..." }, { name: "..." }, ...]
                const formattedItems = response.map((u: { name: string }) => ({
                    label: u.name,
                    value: u.name
                }));
                setItems(formattedItems);
            } catch (error) {
                console.error("Failed to fetch universities:", error);
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to load universities.",
                });
            } finally {
                setIsLoadingUniversities(false);
            }
        };
        fetchUniversities();
    }, []);

    const handleSignUp = async () => {
        if (!fullName || !email || !university || !password || !confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Please fill in all required fields.",
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: "error",
                text1: "Invalid Email",
                text2: "Please enter a valid university email address.",
            });
            return;
        }

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
            await authService.signUp({
                fullName,
                email,
                password,
                university: university,
            });

            Toast.show({
                type: "success",
                text1: "Account Created",
                text2: "Please verify your email.",
            });

            router.push({
                pathname: "/(auth)/verification/[verify]",
                params: { verify: "email", email }
            });
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Sign Up Failed",
                text2: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout showLogo scrollable>
            <FormTitle title="Create your account" />

            <InputField
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
            />

            <UniversityPicker
                open={openDropdown}
                value={university}
                items={items}
                setOpen={setOpenDropdown}
                setValue={setUniversity}
                setItems={setItems}
            />

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

            <InputField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                showToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <Button
                title={isLoading ? "Creating Account..." : "Sign Up"}
                onPress={handleSignUp}
                style="mb-4"
                disabled={isLoading}
            />

            <LinkText
                text="Already have an account?"
                linkText="Sign In"
                onPress={() => router.push("/(auth)/sign-in")}
            />
        </AuthLayout>
    );
};

export default SignUp;

import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AuthLayout from "@/components/auth/AuthLayout";
import FormTitle from "@/components/auth/FormTitle";
import NameInputGroup from "@/components/auth/NameInputGroup";
import UniversityPicker from "@/components/auth/UniversityPicker";
import InputField from "@/components/auth/InputField";
import Button from "@/components/auth/Button";
import LinkText from "@/components/auth/LinkText";
import { UNIVERSITIES } from "@/utils/constants";
import { validateEmail, validateStrongPassword, validatePasswordMatch, getPasswordErrorMessage } from "@/utils/validation";

const SignUp = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [university, setUniversity] = useState<string | null>(null);
    const [items, setItems] = useState(UNIVERSITIES);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = () => {
        if (!firstName || !lastName || !email || !university || !password || !confirmPassword) {
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

        Toast.show({
            type: "success",
            text1: "Account Created",
            text2: "Please verify your email.",
        });

        router.push("/(auth)/verification/email");
    };

    return (
        <AuthLayout showLogo scrollable>
            <FormTitle title="Create your account" />

            <NameInputGroup
                firstName={firstName}
                lastName={lastName}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
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

            <InputField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                showToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <Button title="Sign Up" onPress={handleSignUp} style="mb-4" />

            <LinkText
                text="Already have an account?"
                linkText="Sign In"
                onPress={() => router.push("/(auth)/sign-in")}
            />
        </AuthLayout>
    );
};

export default SignUp;

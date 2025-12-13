import React from "react";
import { View } from "react-native";
import InputField from "./InputField";

interface NameInputGroupProps {
    firstName: string;
    lastName: string;
    onFirstNameChange: (text: string) => void;
    onLastNameChange: (text: string) => void;
}

const NameInputGroup: React.FC<NameInputGroupProps> = ({
    firstName,
    lastName,
    onFirstNameChange,
    onLastNameChange,
}) => {
    return (
        <View className="flex-row justify-between mb-2">
            <View className="flex-1 mr-2">
                <InputField
                    label="First Name"
                    value={firstName}
                    onChangeText={onFirstNameChange}
                    placeholder="John"
                />
            </View>
            <View className="flex-1 ml-2">
                <InputField
                    label="Last Name"
                    value={lastName}
                    onChangeText={onLastNameChange}
                    placeholder="Doe"
                />
            </View>
        </View>
    );
};

export default NameInputGroup;
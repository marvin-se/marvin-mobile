import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface LinkTextProps {
    text: string;
    linkText: string;
    onPress: () => void;
}

const LinkText: React.FC<LinkTextProps> = ({ text, linkText, onPress }) => {
    return (
        <View className="flex-row justify-center">
            <Text className="text-[#182c53] text-base">{text} </Text>
            <TouchableOpacity onPress={onPress}>
                <Text className="text-[#182c53] font-semibold underline text-base">
                    {linkText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LinkText;
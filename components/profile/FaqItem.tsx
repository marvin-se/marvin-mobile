import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItemProps {
    question: string;
    answer: string;
    showBorder?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({
    question,
    answer,
    showBorder = true,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <View
            className={`bg-white px-5 py-4 ${showBorder ? "border-b border-borderPrimary" : ""
                }`}
        >
            <TouchableOpacity
                onPress={toggleExpand}
                className="flex-row justify-between items-center"
                activeOpacity={0.7}
            >
                <Text className="text-lg font-semibold text-textPrimary flex-1 pr-4">
                    {question}
                </Text>
                <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="#72C69B"
                    style={{
                        transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
                    }}
                />
            </TouchableOpacity>

            {isExpanded && (
                <View className="mt-3">
                    <Text className="text-base text-textSecondary leading-6">
                        {answer}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default FAQItem;
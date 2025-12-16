import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabSelectorProps {
    tabs: string[];
    activeTab: number;
    onTabChange: (index: number) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
    tabs,
    activeTab,
    onTabChange,
}) => {
    return (
        <View className="flex-row border-b border-borderPrimary bg-white">
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onTabChange(index)}
                    className="flex-1 py-4"
                    activeOpacity={0.7}
                >
                    <Text
                        className={`text-center text-base font-semibold ${activeTab === index ? "text-primary" : "text-textSecondary"
                            }`}
                    >
                        {tab}
                    </Text>
                    {activeTab === index && (
                        <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TabSelector;
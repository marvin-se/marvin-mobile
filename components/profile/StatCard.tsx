import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface StatCardProps {
    label: string;
    value: number;
    onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, onPress }) => {
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            onPress={onPress}
            activeOpacity={onPress ? 0.5 : 1}
            className="flex-1 items-center py-4 bg-white border border-borderPrimary rounded-xl"
        >
            <Text className="text-2xl font-bold text-primary">{value}</Text>
            <Text className="text-sm text-textSecondary mt-1">{label}</Text>
        </Component>
    );
};

export default StatCard;
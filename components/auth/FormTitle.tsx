import React from "react";
import { Text } from "react-native";

interface FormTitleProps {
    title: string;
    subtitle?: string;
}

const FormTitle: React.FC<FormTitleProps> = ({ title, subtitle }) => {
    return (
        <>
            <Text className="text-3xl font-extrabold text-center text-[#182c53] mb-6 leading-tight">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-center text-[#5a6778] mb-6 text-base">
                    {subtitle}
                </Text>
            )}
        </>
    );
};

export default FormTitle;
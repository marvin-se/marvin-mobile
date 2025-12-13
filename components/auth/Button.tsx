import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonVariant = "primary" | "secondary" | "text";

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: ButtonVariant;
	style?: string;
	textStyle?: string;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = "primary",
	style = "",
	textStyle = "",
	disabled = false,
}) => {
	const getVariantStyles = () => {
		switch (variant) {
			case "secondary":
				return "bg-transparent border border-[#72c69b]";
			case "text":
				return "bg-transparent";
			default:
				return "bg-[#72c69b]";
		}
	};

	const getTextStyles = () => {
		switch (variant) {
			case "secondary":
				return "text-[#72c69b]";
			case "text":
				return "text-[#182c53]";
			default:
				return "text-white";
		}
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			className={`rounded-2xl py-4 ${getVariantStyles()} ${disabled ? 'opacity-50' : ''} ${style}`}
		>
			<Text className={`text-center text-lg font-semibold ${getTextStyles()} ${textStyle}`}>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default Button;
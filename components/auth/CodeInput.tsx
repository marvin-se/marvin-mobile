import React, { useRef } from "react";
import { View, TextInput } from "react-native";

interface CodeInputProps {
    code: string[];
    onCodeChange: (code: string[]) => void;
    length?: number;
}

const CodeInput: React.FC<CodeInputProps> = ({
    code,
    onCodeChange,
    length = 6
}) => {
    const inputs = useRef<(TextInput | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        const newCode = [...code];
        newCode[index] = value;
        onCodeChange(newCode);

        if (value && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View className="flex-row justify-between p-5">
            {Array.from({ length }).map((_, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => {
                        inputs.current[index] = ref;
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    value={code[index]}
                    onChangeText={(value) => handleChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className="w-12 h-12 border border-[#c7cdd8] rounded-xl text-center text-xl text-[#182c53] bg-white"
                />
            ))}
        </View>
    );
};

export default CodeInput;
import React from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface UniversityPickerProps {
    open: boolean;
    value: string | null;
    items: Array<{ label: string; value: string }>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: (value: any) => void;
    setItems: (items: any) => void;
}

const UniversityPicker: React.FC<UniversityPickerProps> = ({
    open,
    value,
    items,
    setOpen,
    setValue,
    setItems,
}) => {
    return (
        <View className="mb-2">
            <Text className="text-[#182c53] text-base font-semibold mb-2 ml-2">
                University Selection
            </Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select your university"
                style={{
                    borderRadius: 16,
                    borderColor: "#d1d5db",
                }}
                dropDownContainerStyle={{
                    borderRadius: 16,
                    borderColor: "#d1d5db",
                }}
                zIndex={1000}
            />
        </View>
    );
};

export default UniversityPicker;
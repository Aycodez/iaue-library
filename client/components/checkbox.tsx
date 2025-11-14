import { TouchableOpacity, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import React from "react";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: React.ReactNode;
  disabled?: boolean;
  size?: number;
  containerStyle?: string;
}

const Checkbox = ({
  checked,
  onToggle,
  label,
  disabled = false,
  size = 20,
  containerStyle = "",
}: CheckboxProps) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center my-2 gap-x-2 ${containerStyle}`}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        className={`rounded-md border-[1.5px] border-[#6932E2] items-center justify-center`}
        style={{ width: size, height: size }}
      >
        {checked && (
          <HugeiconsIcon
            strokeWidth={2.7}
            icon={Tick02Icon}
            size={size * 0.7}
            color="#6932E2"
          />
        )}
      </View>

      {label}
    </TouchableOpacity>
  );
};

export default Checkbox;

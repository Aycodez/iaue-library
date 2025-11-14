import React from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { CustomText } from "./custom-text";

// Basic, reusable button with sensible defaults. Memoized to avoid
// re-renders when props are unchanged.
type ButtonProps = {
  children?: React.ReactNode;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  buttonClassName?: string;
  textClassName?: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
};

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  text,
  onPress,
  disabled = false,
  buttonClassName,
  textClassName,
  loading,
  variant = "primary",
}) => {
  const className = `flex flex-row items-center justify-center bg-black py-3.5 w-full rounded-lg  ${
    disabled ? "opacity-50" : "opacity-100"
  } ${buttonClassName}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={className}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={text}
    >
      <CustomText
        className={`text-white self-center font-SfProBold text-center ${textClassName}`}
      >
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

const Button = React.memo(ButtonComponent);
export default Button;

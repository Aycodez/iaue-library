import React from "react";
import { Text, TextProps } from "react-native";

type CustomTextProps = TextProps & {
  variant?: "regular" | "medium" | "semibold" | "bold";
};

export const CustomText: React.FC<CustomTextProps> = ({
  variant = "regular",
  className,
  ...props
}) => {
  return (
    <Text
      className={`text-base
        ${variant === "regular" && "font-SfPro"}
       ${variant === "medium" && "font-SfProMedium"} 
       ${variant === "semibold" && "font-SfProSemibold"} 
       ${variant === "bold" && "font-SfProBold"} 
       ${className}`}
      {...props}
    />
  );
};

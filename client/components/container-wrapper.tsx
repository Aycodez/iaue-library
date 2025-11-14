import React from "react";
import { View, ViewProps } from "react-native";

export default function ContainerWrapper({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & ViewProps) {
  return (
    <View
      {...props}
      className={`rounded-[32px] w-full bg-foreground p-4 ${className}`}
    >
      {children}
    </View>
  );
}

import { View, Text, Image } from "react-native";
import React from "react";
import { Check } from "../constants/icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export default function RoundedIcon({
  icon,
  size = 25,
}: {
  icon: any;
  size?: number;
}) {
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
      }}
      className="bg-white relative overflow-hidden w-16 h-16 flex items-center justify-center rounded-full"
    >
      <View className="z-[999]">
        <HugeiconsIcon
          icon={icon}
          size={size}
          strokeWidth={1.5}
          color="#6932E2"
        />
      </View>
      <Image
        source={Check}
        style={{ height: 40, width: 40 }}
        className="w-10 h-10 absolute opacity-80 -bottom-2 z-10 -left-1"
        resizeMode="contain"
      />
    </View>
  );
}

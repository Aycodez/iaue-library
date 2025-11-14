import { View } from "react-native";
import React from "react";

export default function StepIndicator({
  currentIndex,
}: {
  currentIndex: number;
}) {
  return (
    <View className="flex-row justify-center mt-4 mb-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          className={`h-1 rounded-full mx-1 ${
            currentIndex === index ? "bg-primary w-8" : "bg-secondary-text w-3"
          }`}
        />
      ))}
    </View>
  );
}

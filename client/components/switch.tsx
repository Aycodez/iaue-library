import React from "react";
import {
  Animated,
  GestureResponderEvent,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  style?: ViewStyle;
}

export default function Switch({
  value,
  onValueChange,
  size = "sm",
  disabled = false,
  activeColor = "transparent",
  inactiveColor = "#E5E7EB",
  thumbColor = "#FFFFFF",
  style,
}: SwitchProps) {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  const sizeConfig = {
    sm: {
      width: 24,
      height: 14,
      thumbSize: 8,
      padding: 3,
    },
    md: {
      width: 44,
      height: 24,
      thumbSize: 20,
      padding: 2,
    },
    lg: {
      width: 52,
      height: 28,
      thumbSize: 24,
      padding: 2,
    },
  };

  const config = sizeConfig[size];

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      config.padding,
      config.width - config.thumbSize - config.padding,
    ],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: config.width,
          height: config.height,
          borderRadius: config.height / 2,
          // backgroundColor: trackColor,
          justifyContent: "center",
          position: "relative",
          borderWidth: 1.5,
          borderColor: "#0F0F0F",
        }}
        className={"border"}
      >
        <Animated.View
          style={{
            width: config.thumbSize,
            height: config.thumbSize,
            borderRadius: config.thumbSize / 2,
            backgroundColor: thumbColor,
            position: "absolute",
            transform: [{ translateX: thumbTranslateX }],
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
            borderWidth: 1.5,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

import { useEffect } from "react";
import { View, Animated, Platform } from "react-native";
import { CustomText } from "./custom-text";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "info",
  visible,
  onHide,
  duration = 3000,
}: ToastProps) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <Animated.View
      style={{
        opacity,
        position: Platform.OS === "web" ? "fixed" : "absolute",
        top: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      <View className={`${bgColor} p-4 rounded-lg shadow-lg`}>
        <CustomText variant="bold" className="text-white text-center">
          {message}
        </CustomText>
      </View>
    </Animated.View>
  );
};

export default Toast;

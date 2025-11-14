import classNames from "classnames";
import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
  ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MaxWidthWrapperProps = ViewProps & {
  scrollable?: boolean;
  backgroundColor?: string;
  style?: object;
};

export default function MaxWidthWrapper({
  children,
  className,
  style,
  scrollable = false,
  ...props
}: MaxWidthWrapperProps) {
  const { height } = Dimensions.get("window");
  return (
    <SafeAreaView
      style={{ backgroundColor: "white", height, maxWidth: 500 }}
      className="flex-1 mx-auto w-full"
    >
      <StatusBar barStyle={"default"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        className="flex-1"
      >
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: height, ...style }}
            className={classNames("flex-1 h-full py-2.5 pt-5 px-5")}
            {...props}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            className={classNames(
              "h-full py-2.5 pt-5 px-5 bg-white",
              className
            )}
          >
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

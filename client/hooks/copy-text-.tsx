import * as Clipboard from "expo-clipboard";
import { Alert, Platform, ToastAndroid } from "react-native";

export const copyWithFeedback = (
  text: string,
  message = "Copied to clipboard"
) => {
  Clipboard.setStringAsync(text);

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("Success", message);
  }
};

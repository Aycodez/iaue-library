import { Platform, TextInput, View } from "react-native";
import { InputFieldProps } from "../types";
import { CustomText } from "./custom-text";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <View className="w-full my-2 mb-4">
      {label && (
        <CustomText
          variant="medium"
          className={` text-primary-text text-base mb-2 ${labelStyle}`}
        >
          {label}
        </CustomText>
      )}
      <View
        style={{ height: Platform.OS === "web" ? 56 : 64 }}
        className={`flex h-16 bg-background flex-row justify-between rounded-lg items-center ${containerStyle}`}
      >
        <TextInput
          className={`pl-2 mb-1 h-full font-SfPro text-base flex-1 ${inputStyle} text-left`}
          style={
            Platform.OS === "web"
              ? ({
                  outline: "none",
                  outlineWidth: 0,
                  boxShadow: "none",
                  borderWidth: 0,
                  borderColor: "transparent",
                  outlineColor: "transparent",
                } as any)
              : {
                  borderWidth: 0,
                }
          }
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#C8C8C8"
          {...props}
        />
        <View className="mr-3">{icon}</View>
      </View>
    </View>
  );
};

export default InputField;

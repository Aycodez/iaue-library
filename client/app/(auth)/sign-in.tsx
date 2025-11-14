import { CustomText } from "../../components/custom-text";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import { View } from "react-native";
import InputField from "../../components/input-field";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { EyeIcon } from "@hugeicons/core-free-icons";
import Button from "../../components/button";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const user = await signIn(email, password);

      // Navigate based on role
      if (user.role === "lecturer") {
        router.replace("/(lecturer)/lecturer-home");
      } else {
        router.replace("/(student)/student-home");
      }
    } catch (error: any) {
      alert(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaxWidthWrapper scrollable>
      <View className="h-full w-full flex-1 flex flex-col justify-center mt-12 items-center gap-y-2">
        <CustomText variant="bold" className="!text-3xl">
          Login
        </CustomText>

        <InputField
          label="Email Address"
          placeholder="Enter your Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          label="Password"
          secureTextEntry={true}
          placeholder="Enter your Password"
          icon={<HugeiconsIcon icon={EyeIcon} size={18} color="#C8C8C8" />}
          value={password}
          onChangeText={setPassword}
        />

        <Button
          text={isLoading ? "Logging In..." : "Log In"}
          onPress={handleSignIn}
          buttonClassName="mt-4"
          disabled={isLoading}
        />
        <CustomText
          style={{ color: "#000000E5" }}
          variant="medium"
          className="text-sm mt-5"
        >
          Don&apos;t have an account?{" "}
          <CustomText
            onPress={() => router.push("/(auth)/sign-up")}
            variant="bold"
            className="text-black text-sm"
          >
            Sign up instead
          </CustomText>
        </CustomText>
      </View>
    </MaxWidthWrapper>
  );
};
export default SignIn;

import { CustomText } from "../../components/custom-text";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import { View, TouchableOpacity } from "react-native";
import InputField from "../../components/input-field";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { EyeIcon } from "@hugeicons/core-free-icons";
import Button from "../../components/button";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { SERVER_URL } from "../../constants";

const SignUp = () => {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/users`, {
        fullName,
        email,
        password,
        role,
      });
      console.log(res.data);

      if (res.data.success) {
        router.replace("/sign-in");
      }
    } catch (error: any) {
      alert(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaxWidthWrapper scrollable>
      <View className="h-full w-full flex-1 flex flex-col justify-center mt-12 items-center gap-y-2">
        <CustomText variant="bold" className="text-3xl">
          Registration
        </CustomText>

        {/* Role Selection */}
        <View className="w-full px-4 mt-4 mb-2">
          <CustomText variant="medium" className="text-sm mb-2 text-gray-700">
            I am a:
          </CustomText>
          <View className="flex-row gap-x-3">
            <TouchableOpacity
              onPress={() => setRole("student")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                role === "student"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <CustomText
                variant="bold"
                className={`text-center ${
                  role === "student" ? "text-white" : "text-gray-700"
                }`}
              >
                📚 Student
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRole("lecturer")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                role === "lecturer"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <CustomText
                variant="bold"
                className={`text-center ${
                  role === "lecturer" ? "text-white" : "text-gray-700"
                }`}
              >
                👨‍🏫 Lecturer
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <InputField
          label="Full Name"
          placeholder="Enter your Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

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

        <InputField
          label="Confirm Password"
          secureTextEntry={true}
          placeholder="Confirm your Password"
          icon={<HugeiconsIcon icon={EyeIcon} size={18} color="#C8C8C8" />}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button
          text={isLoading ? "Signing Up..." : "Sign Up"}
          onPress={handleSignUp}
          buttonClassName="mt-4"
          disabled={isLoading}
        />

        <CustomText
          style={{ color: "#000000E5" }}
          variant="medium"
          className="text-sm mt-5"
        >
          Already have an account?{" "}
          <CustomText
            onPress={() => router.push("/sign-in")}
            variant="bold"
            className="text-black text-sm"
          >
            Log in instead
          </CustomText>
        </CustomText>
      </View>
    </MaxWidthWrapper>
  );
};

export default SignUp;

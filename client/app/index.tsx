import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const Page = () => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6932E2" />
      </View>
    );
  }

  // Redirect based on auth state
  if (user) {
    if (user.role === "lecturer") {
      return <Redirect href="/(lecturer)/lecturer-home" />;
    } else {
      return <Redirect href="/(student)/student-home" />;
    }
  }

  // Not authenticated - go to onboarding
  return <Redirect href="/(auth)/sign-in" />;
};

export default Page;

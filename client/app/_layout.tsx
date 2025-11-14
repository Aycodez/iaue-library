import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { TextbookProvider } from "../contexts/TextbookContext";
import "../global.css";
import { QueryProvider } from "../contexts/query-provider";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SfPro: require("../assets/fonts/SfProRegular.otf"),
    SfProBold: require("../assets/fonts/SfProBold.otf"),
    SfProMedium: require("../assets/fonts/SfProMedium.otf"),
    SfProSemibold: require("../assets/fonts/SfProSemibold.otf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <QueryProvider>
        <TextbookProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(lecturer)" />
            <Stack.Screen name="(student)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </TextbookProvider>
      </QueryProvider>
    </AuthProvider>
  );
}

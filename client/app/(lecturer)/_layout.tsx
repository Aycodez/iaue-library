import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="upload" />
    </Stack>
  );
}

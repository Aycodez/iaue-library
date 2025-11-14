import { Stack } from "expo-router";

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="browse" />
      <Stack.Screen name="textbook-detail" />
    </Stack>
  );
}

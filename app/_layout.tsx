// app/_layout.js
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false, // This hides the header for all screens
        }}
      >
        <Stack.Screen
          name="(tabs)" // This must match your folder name
        />
      </Stack>
    </SafeAreaProvider>
  );
}

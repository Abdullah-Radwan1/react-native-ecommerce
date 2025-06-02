// app/_layout.js
import { COLORS } from "@/constants/theme";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const theme = {
    colors: {
      primary: COLORS.primary, // Your blue color
      accent: COLORS.accent2, // Your green color
      background: COLORS.background,
      text: COLORS.text,
      placeholder: COLORS.textLight,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
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
      </ClerkProvider>
    </PaperProvider>
  );
}

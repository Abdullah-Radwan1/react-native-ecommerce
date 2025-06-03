import { COLORS } from "@/constants/theme";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const theme = {
    dark: true,

    colors: {
      primary: COLORS.primary,
      accent: COLORS.accent2,
      background: COLORS.background,
      surface: COLORS.lightGrey,
      text: "white",
      placeholder: COLORS.textLight,
      onSurface: COLORS.text,
      disabled: "#555",
      error: COLORS.accent2,
      notification: COLORS.accent1,
      backdrop: "rgba(0,0,0,0.5)",
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
              headerShown: false,
            }}
          />
        </SafeAreaProvider>
      </ClerkProvider>
    </PaperProvider>
  );
}

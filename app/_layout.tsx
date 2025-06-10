import { COLORS } from "@/constants/theme";
import ClrekAndConvex from "@/providers/ClrekAndConvex";

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
      <ClrekAndConvex>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaProvider>
      </ClrekAndConvex>
    </PaperProvider>
  );
}

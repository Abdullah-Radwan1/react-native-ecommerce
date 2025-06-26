import { COLORS } from "@/constants/theme";
import ClrekAndConvex from "@/providers/ClrekAndConvex";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useCallback } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "jetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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
          <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </SafeAreaProvider>
      </ClrekAndConvex>
    </PaperProvider>
  );
}

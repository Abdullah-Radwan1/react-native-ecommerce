import { COLORS } from "@/constants/theme";
import ClrekAndConvex from "@/providers/ClrekAndConvex";
import { ClerkLoaded } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
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

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLORS.background);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  if (!fontsLoaded) return null;

  return (
    <PaperProvider
      theme={{
        dark: true,
        colors: {
          primary: COLORS.primary,
          surface: COLORS.darkGrey,
          text: "white",
          placeholder: COLORS.textLight,
          onSurface: COLORS.text,
          disabled: "#555",
          notification: COLORS.accent1,
          backdrop: "rgba(0,0,0,0.5)",
        },
      }}
    >
      <ClrekAndConvex>
        <ClerkLoaded>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </SafeAreaProvider>
        </ClerkLoaded>
      </ClrekAndConvex>
    </PaperProvider>
  );
}

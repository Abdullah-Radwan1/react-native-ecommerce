import { useClerk } from "@clerk/clerk-expo";
import { useRootNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SSOCallbackScreen() {
  const router = useRouter();
  const { isSignedIn } = useClerk();
  const rootNavigation = useRootNavigation(); // Detect if root layout is ready
  const [navigationReady, setNavigationReady] = useState(false);

  // Wait for root layout to mount before navigating
  useEffect(() => {
    if (rootNavigation?.isReady()) {
      setNavigationReady(true);
    } else {
      const unsubscribe = rootNavigation?.addListener("state", () => {
        if (rootNavigation.isReady()) {
          setNavigationReady(true);
        }
      });
      return unsubscribe;
    }
  }, [rootNavigation]);

  // Only navigate once the router is ready
  useEffect(() => {
    if (navigationReady || isSignedIn) {
      router.replace("/(tabs)/home"); // ✅ Safe manual redirect
    }
  }, [navigationReady]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

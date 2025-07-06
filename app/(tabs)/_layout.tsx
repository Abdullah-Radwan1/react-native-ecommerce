// app/(tabs)/_layout.js
import { COLORS } from "@/constants/theme";
import { useClerk } from "@clerk/clerk-expo";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as navigation_bar from "expo-navigation-bar";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
export default function TabsLayout() {
  const { isSignedIn, loaded } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn && loaded) {
      router.push("/sign_in");
    }
    if (Platform.OS === "android") {
      navigation_bar.setBackgroundColorAsync(COLORS.background);
      navigation_bar.setButtonStyleAsync("light");
    }
  }, [isSignedIn]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // This shows the header
        tabBarShowLabel: false, // This hides the titles
        tabBarStyle: {
          backgroundColor: "black",
          position: "absolute",
          height: 40,
          elevation: 0,
        },
        sceneStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color

          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.white,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.white,
        }}
      />
      <Tabs.Screen
        name="createPost"
        options={{
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.white,
        }}
      />
      <Tabs.Screen
        name="booked"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.white,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.white,
        }}
      />
    </Tabs>
  );
}

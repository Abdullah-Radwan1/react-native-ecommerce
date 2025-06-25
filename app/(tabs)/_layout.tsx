// app/(tabs)/_layout.js
import { COLORS } from "@/constants/theme";
import { useClerk } from "@clerk/clerk-expo";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
export default function TabsLayout() {
  const { isSignedIn } = useClerk();
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign_in" />;
  }
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
        sceneStyle: { backgroundColor: "black" },
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
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.textLight,
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
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.textLight,
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
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.textLight,
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.textLight,
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
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.textLight,
        }}
      />
    </Tabs>
  );
}

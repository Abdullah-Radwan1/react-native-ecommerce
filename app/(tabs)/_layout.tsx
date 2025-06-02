// app/(tabs)/_layout.js
import { COLORS } from "@/constants/theme";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // This hides the titles
        tabBarStyle: {
          backgroundColor: "black",

          position: "absolute",
          height: 40,

          elevation: 0,
        },
      }}
    >
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
          tabBarInactiveTintColor: COLORS.lightGrey,
        }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          title: "home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.lightGrey,
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite-border" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black", // Title and icons color
          },
          headerTintColor: "white", // Title text color
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.lightGrey,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-o" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.lightGrey,
        }}
      />

      <Tabs.Screen
        name="createPost"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primaryLight,
          tabBarInactiveTintColor: COLORS.lightGrey,
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f26", // Cool dark background
    padding: 16,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

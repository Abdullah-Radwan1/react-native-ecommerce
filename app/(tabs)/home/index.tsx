import Loader from "@/app/components/Loader";
import PostUI from "@/app/components/PostUI";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import React from "react";
import { FlatList, Image, View } from "react-native";
import { Text } from "react-native-paper";

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // ✅ Always call the hook, but it returns undefined if not signed in
  const posts = useQuery(
    api.post.getFeedPosts,
    isLoaded && isSignedIn ? {} : "skip"
  );
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign_in" />;
  }
  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "jetBrainsMono-Medium",
            fontSize: 26,
            color: COLORS.primaryLight,
          }}
        >
          Chirp
        </Text>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>

      {/* Posts */}
      <FlatList
        data={posts ?? []}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 30 }}>
            <PostUI post={{ ...item, bookmarked: item.isBooked }} />
          </View>
        )}
        keyExtractor={(post) => post._id}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Loader />
          </View>
        }
      />
    </View>
  );
};

export default Index;

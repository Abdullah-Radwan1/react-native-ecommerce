import Loader from "@/app/components/Loader";
import PostUI from "@/app/components/PostUI";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
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

  return (
    <View style={{ flex: 1, padding: 12, marginBottom: 20 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "jetBrainsMono-Medium",
            fontSize: 26,
            color: COLORS.primaryLight,
          }}
        >
          FunnyGram
        </Text>
        <Image
          source={require("@/assets/images/Icon.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>

      {/* Posts */}
      <FlatList
        data={posts ?? []}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 25 }}>
            <PostUI post={{ ...item, bookmarked: item.isBooked }} />
          </View>
        )}
        keyExtractor={(post) => post._id}
        ListEmptyComponent={<Loader />}
      />
    </View>
  );
};

export default Index;

import Loader from "@/app/components/Loader";
import PostUI from "@/app/components/PostUI";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Image, View } from "react-native";
import { Text } from "react-native-paper";

const index = () => {
  const posts = useQuery(api.post.getFeedPosts);

  if (posts === undefined) return <Loader />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Header outside FlatList */}
      <View
        style={{
          display: "flex",
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
            alignItems: "center",
            display: "flex",
            gap: 2,
          }}
        >
          Momentum
        </Text>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 30, height: 30 }} // ✅ Load from assets
        />
      </View>

      {/* Single FlatList for all posts */}

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 30 }}>
            <PostUI post={{ ...item, bookmarked: item.isBooked }} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyExtractor={(post) => post._id}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: COLORS.textLight }}>No posts yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default index;

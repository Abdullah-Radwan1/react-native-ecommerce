import Loader from "@/app/components/Loader";
import PostUI from "@/app/components/PostUI";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";

const index = () => {
  const { signOut } = useAuth();
  const posts = useQuery(api.post.getFeedPosts);

  console.log("posts:", posts);
  if (posts === undefined) return <Loader />;

  return posts.map((post) => (
    <View key={post._id} style={{ marginBottom: 20 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "jetBrainsMono-Medium",
            fontSize: 26,
            color: COLORS.primaryLight,
          }}
        >
          {" "}
          Momentum
        </Text>
        <Ionicons name="log-out-outline" color={"white"} size={26} />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => {
          return <PostUI post={{ ...post, bookmarked: item.isBooked }} />;
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(post) => post._id}
      />
    </View>
  ));
};

export default index;

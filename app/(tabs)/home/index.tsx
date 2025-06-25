import Loader from "@/app/components/Loader";
import PostUI from "@/app/components/PostUI";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import { View } from "react-native";

const index = () => {
  const { signOut } = useAuth();
  const posts = useQuery(api.post.getFeedPosts);

  console.log("posts:", posts);
  if (posts === undefined) return <Loader />;

  return posts.map((post) => (
    <View key={post._id} style={{ marginBottom: 20 }}>
      <PostUI
        post={{ ...post, isLiked: post.isLiked, bookmarked: post.isBooked }}
      />
    </View>
  ));
};

export default index;

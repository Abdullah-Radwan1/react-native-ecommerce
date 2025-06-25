import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PostUIProps = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string | undefined;
    userId: Id<"users">;
    imageUrl: string;
    storageId: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    bookmarked: boolean;
    author: {
      username: string;
      image: string;
    };
  };
};
const PostUI = ({ post }: PostUIProps) => {
  const [isliked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const toggleLike = useMutation(api.post.toggleLike);
  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: post._id });
      setIsLiked(newIsLiked);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header with author info */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Image source={post.author.image || ""} style={styles.avatar} />
          <Text style={styles.authorName}>{post.author.username}</Text>
        </View>

        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Post content */}
      <View style={styles.content}>
        <Text style={styles.postText}>{post.caption}</Text>
      </View>
      <Image style={styles.postImage} source={{ uri: post.imageUrl }} />

      {/* Action buttons */}
      <View style={styles.actions}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              onPress={handleLike}
              name={isliked ? "heart" : "heart-outline"}
              size={24}
              color={isliked ? COLORS.primaryLight : COLORS.textLight}
            />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              name="comment-outline"
              size={24}
              color={COLORS.textLight}
            />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons
              name="bookmark-border"
              size={24}
              color={COLORS.textLight}
            />
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 5,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
  content: {
    marginBottom: 6,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    color: "white",
  },
  actions: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",

    borderTopWidth: 1,
    borderTopColor: "white",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default PostUI;

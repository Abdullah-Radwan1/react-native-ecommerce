import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import CommentsModal from "./commentsModal";

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
      image: string; //this type is of
    };
  };
};
const PostUI = ({ post }: PostUIProps) => {
  const [isliked, setIsLiked] = useState(post.isLiked);
  const [isBooked, setIsBooked] = useState(post.bookmarked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [onClose, setonclose] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleLike = useMutation(api.post.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookark);
  const deletePost = useMutation(api.post.deletePost);

  const { user } = useUser();
  const convexUser = useQuery(
    api.user.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );
  const userId = useQuery(api.user.getUserByClerkId, {
    clerkId: user?.id as Id<"users">,
  })?._id;
  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: post._id });
      setIsLiked(newIsLiked);
      setLikeCount((perv) => {
        return newIsLiked ? perv + 1 : perv - 1;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    const newIsBooked = await toggleBookmark({ postId: post._id });
    setIsBooked(newIsBooked);
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await deletePost({ postId: post._id });
      setDeleteModalVisible(false);
      // You might want to add a callback here to refresh the posts list
    } catch (error) {
      console.log("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header with author info */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Link
            href={
              post.userId === userId
                ? "/(tabs)/profile"
                : `/user/${post.userId}`
            }
            asChild
          >
            <Image source={post.imageUrl} style={styles.avatar} />
          </Link>
          <Text style={styles.authorName}>{post.author.username}</Text>
        </View>

        {convexUser?._id === post.userId ? (
          <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
            <Ionicons name="trash-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <Feather color={COLORS.white} name="more-vertical" size={20} />
        )}
      </View>

      {/* Post content */}
      <View style={styles.content}>
        <Text style={styles.postText}>{post.caption}</Text>
      </View>
      <Image style={styles.postImage} source={{ uri: post.imageUrl }} />

      {/* Action buttons */}
      <View style={styles.actions}>
        <View>
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 20 }}
          >
            <TouchableOpacity style={styles.like}>
              <MaterialCommunityIcons
                onPress={handleLike}
                name={isliked ? "heart" : "heart-outline"}
                size={24}
                color={isliked ? COLORS.primaryLight : COLORS.textLight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setonclose(true);
              }}
              style={styles.comment}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={24}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{ color: COLORS.textLight, fontSize: 12, marginTop: 10 }}
          >
            {likeCount === 0
              ? "be the first to like !"
              : `${likeCount} liked this`}{" "}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={handleBookmark} style={styles.book}>
            <MaterialIcons
              name="bookmark-border"
              size={24}
              color={isBooked ? COLORS.primaryLight : COLORS.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments Modal */}
      <CommentsModal
        onClose={() => {
          setonclose(false);
        }}
        postId={post._id}
        onCommentAdd={handleLike}
        visible={onClose}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => setDeleteModalVisible(false)}
        onBackButtonPress={() => setDeleteModalVisible(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Ionicons
              name="warning-outline"
              size={48}
              color={COLORS.error}
              style={styles.warningIcon}
            />

            <Text style={styles.deleteModalTitle}>Delete Post</Text>

            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeletePost}
                disabled={isDeleting}
              >
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "white",
    paddingTop: 10,
  },
  like: {
    flexDirection: "column",
  },
  comment: {
    flexDirection: "row",
    alignItems: "center",
  },
  book: {},
  actionText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  // Delete Modal Styles
  deleteModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteModalContent: {
    backgroundColor: COLORS.lightGrey || "#1a1a1a",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  warningIcon: {
    marginBottom: 15,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white || "white",
    marginBottom: 10,
    textAlign: "center",
  },
  deleteModalMessage: {
    fontSize: 16,
    color: COLORS.textLight || "#cccccc",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: COLORS.error || "#666666",
  },
  cancelButtonText: {
    color: COLORS.white || "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PostUI;

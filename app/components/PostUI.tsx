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
import { Snackbar } from "react-native-paper";
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
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
    if (newIsBooked) {
      setSnackbarMessage("Bookmarked");
      setVisible(true);
    } else {
      setSnackbarMessage("Unbookmarked");
      setVisible(true);
    }
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
            <TouchableOpacity style={styles.authorInfo}>
              <Image
                source={{ uri: post.author.image }}
                style={styles.avatar}
              />
              <Text style={styles.authorName}>{post.author.username}</Text>
            </TouchableOpacity>
          </Link>
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
                color={isliked ? COLORS.primary : COLORS.white}
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
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ color: COLORS.white, fontSize: 12, marginTop: 10 }}>
            {likeCount === 0
              ? "be the first to like !"
              : `${likeCount} liked this`}{" "}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={handleBookmark}>
            <MaterialIcons
              name="bookmark-border"
              size={24}
              color={isBooked ? COLORS.primary : COLORS.white}
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
      <Snackbar
        style={styles.snackbar}
        visible={visible}
        onDismiss={() => setVisible(false)}
        // duration={5000}
        icon={"check"}
      >
        <Text style={{ color: COLORS.white }}>{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
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
  actionText: {
    fontSize: 14,
    color: COLORS.white,
  },
  // Delete Modal Styles
  deleteModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteModalContent: {
    backgroundColor: COLORS.black || "#1a1a1a",
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
    color: COLORS.white || "#cccccc",
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
  snackbar: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    bottom: 20,
    left: 20,
    position: "absolute",
  },
});

export default PostUI;

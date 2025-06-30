import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import Loader from "../components/Loader";

export default function Booked() {
  const bookedPosts = useQuery(api.bookmarks.getBookmarks);
  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const user = useQuery(
    api.user.getUserProfile,
    selectedPost
      ? {
          userId: selectedPost?.userId as Id<"users">,
        }
      : "skip"
  );

  if (!bookedPosts) {
    return <Loader />;
  }

  if (bookedPosts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Bookmarks Yet 💔</Text>
      </View>
    );
  }

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const imageSize = (screenWidth - 16) / numColumns;

  const handlePostPress = (post: Doc<"posts">) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  return (
    <>
      <FlatList
        data={bookedPosts}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.imageWrapper,
              { width: imageSize, height: imageSize },
            ]}
            onPress={() => handlePostPress(item)}
          >
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?._id || ""}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Bookmarks Yet 💔</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedPost(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Link
              style={styles.authorContainer}
              href={`/user/${selectedPost?.userId}`}
            >
              {user && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={{ uri: user.image }}
                    style={styles.authorImage}
                  />
                  <Text style={styles.authorName}>{user.username}</Text>
                </View>
              )}
            </Link>
            {selectedPost && (
              <>
                <Image
                  source={{ uri: selectedPost.imageUrl }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />

                <View style={styles.captionContainer}>
                  <Text style={styles.captionText}>{selectedPost.caption}</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedPost(null);
                  }}
                >
                  <Ionicons name="close-outline" size={30} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.primaryLight,
    fontSize: 24,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    paddingBottom: 20,
  },
  modalImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 5,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    alignSelf: "flex-start",
    gap: 8,
  },
  authorImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  authorName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  captionContainer: {
    width: "100%",

    paddingTop: 10,
  },
  captionText: {
    color: COLORS.textLight,
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 10,
  },
});

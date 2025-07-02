import { COLORS } from "@/constants/theme"; // Make sure COLORS is defined
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import Loader from "../components/Loader";

const ProfileScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useLocalSearchParams();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [visible, setVisible] = useState(false);
  console.log(visible);
  const user = useQuery(api.user.getUserProfile, { userId: id as Id<"users"> });
  const userposts = useQuery(api.user.getUserPosts, {
    userId: id as Id<"users">,
  });
  const followStatus = useQuery(api.user.getFollowStatus, {
    targetUserId: id as Id<"users">,
  });
  useEffect(() => {
    setIsFollowing(followStatus);
  }, [followStatus]);
  const toggleFollow = useMutation(api.user.toggleFollow);
  const [isFollowing, setIsFollowing] = useState(followStatus);

  if (!user) {
    return <Loader />;
  }

  const handleFollow = async () => {
    const result = await toggleFollow({ followerId: user._id });
    setIsFollowing(result); // result is true if now following, false if unfollowed
    if (result === false) {
      setVisible(true);
      setSnackbarMessage(`Unfollowed ${user.username}`);
    } else {
      setVisible(true);
      setSnackbarMessage(`Now Following ${user.username}!`);
    }
  };
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{user.username}</Text>
        <Ionicons
          onPress={handleGoBack}
          name="arrow-back-outline"
          size={24}
          color={COLORS.text}
        />
      </View>
      <View style={styles.profileSection}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.bio}>{user.bio ? user.bio : "no bio yet"}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{user.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{user.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{user.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleFollow}
        style={isFollowing ? styles.unfollowButton : styles.followButton}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: COLORS.text,
          }}
        >
          {isFollowing === undefined
            ? "Loading..."
            : isFollowing
              ? "Following"
              : "Follow"}
        </Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}> Posts</Text>
        {userposts?.length === 0 ? (
          <Text style={styles.noPosts}>No Posts Yet</Text>
        ) : (
          <FlatList
            data={userposts}
            numColumns={3} // This enables the grid layout
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(item.imageUrl);
                  setModalVisible(true);
                }}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {/* Post Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {selectedImage && (
            <>
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
      {/* Edit Profile Modal */}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },

  bio: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statBox: {
    alignItems: "center",
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.accent1,
  },

  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.primaryLight,
    marginVertical: 12,
    fontFamily: "jetBrainsMono-Medium",
  },

  image: {
    height: 100,
    width: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },

  // Post Modal
  noPosts: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "jetBrainsMono-Medium",
    color: COLORS.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  closeButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },

  followButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    marginTop: 10,
  },
  unfollowButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    marginTop: 10,
    borderColor: COLORS.primaryLight,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
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

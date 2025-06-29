import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "../(auth)/sign_out_button";
import Loader from "../components/Loader";

export default function Profile() {
  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const [selectEditProfile, setSelectEditProfile] = useState(false);
  const { user } = useClerk();

  const userData = useQuery(
    api.user.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const posts = useQuery(
    api.post.getUserPosts,
    userData ? { userId: userData?._id } : "skip"
  );
  const updateProfile = useMutation(api.user.updateUser);

  const [username, setUsername] = useState(userData?.username);

  const [bio, setBio] = useState(userData?.bio);
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setBio(userData.bio || "");
    }
  }, [userData]);
  if (!user || userData === undefined) return <Loader />;
  const imageUrl = user.imageUrl;
  const followers = userData?.followers || 0;
  const following = userData?.following || 0;
  const NumberOfPosts = posts?.length || 0;

  const handleSaveProfile = async () => {
    // Call Convex mutation here to update profile
    setSelectEditProfile(false);
    if (!userData?._id) {
      Redirect({ href: "/(auth)/sign_in" });
      return;
    }
    await updateProfile({
      username,
      bio,
      id: userData?._id,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <SignOutButton />
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
        <View style={styles.statsContainer}>
          <Stat label="Posts" count={NumberOfPosts} />
          <Stat label="Followers" count={followers} />
          <Stat label="Following" count={following} />
        </View>
        <TouchableOpacity
          style={styles.edit}
          onPress={() => setSelectEditProfile(true)}
        >
          <Text style={{ color: COLORS.white, textAlign: "center" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Posts Section */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Posts</Text>
        {NumberOfPosts === 0 || posts === undefined ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts Yet</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            <FlatList
              data={posts}
              keyExtractor={(item) => item._id}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedPost(item)}
                  style={styles.imageWrapper}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Post Modal */}
      <Modal
        visible={!!selectedPost}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalContainer}>
          {selectedPost && (
            <>
              <Image
                source={{ uri: selectedPost.imageUrl }}
                style={styles.modalImage}
              />
              <Text style={styles.modalText}>{selectedPost.caption}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedPost(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={selectEditProfile}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectEditProfile(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.editModalContainer}
        >
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setSelectEditProfile(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Username"
              placeholderTextColor={COLORS.textLight}
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              maxLength={20} // ✅ LIMIT TO 20 CHARACTERS
            />

            <TextInput
              placeholder="Bio"
              placeholderTextColor={COLORS.textLight}
              value={bio}
              onChangeText={setBio}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              maxLength={40} // ✅ LIMIT TO 20 CHARACTERS
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function Stat({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3 - 4 * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    color: COLORS.primaryLight,
    fontWeight: "bold",
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
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statBox: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.accent1,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  edit: {
    backgroundColor: COLORS.border,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
    width: "80%",
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.primaryLight,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 18,
    textAlign: "center",
  },

  // Post Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Edit Profile Modal
  editModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    padding: 20,
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
    padding: 10,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 15,
    backgroundColor: COLORS.lightGrey,
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
    marginRight: 10,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

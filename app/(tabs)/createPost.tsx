// PostCreationScreen.tsx
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";

export default function PostCreationScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useClerk();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
      aspect: [1, 1],
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setImage(null);
    setCaption("");
  };

  const generatePostUrl = useMutation(api.post.generatePostUrl);
  const createPost = useMutation(api.post.createPost);

  const handleShare = async () => {
    if (!image || !caption.trim()) return;
    try {
      setUploading(true);
      const uploadUrl = await generatePostUrl();
      const uploadresult = await FileSystem.uploadAsync(uploadUrl, image, {
        httpMethod: "POST",
        mimeType: "image/jpeg",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });
      if (uploadresult.status !== 200) {
        throw new Error("Image upload failed");
      }
      const { storageId } = JSON.parse(uploadresult.body);
      await createPost({ storageId, caption });
      router.push("/(tabs)/home");
    } catch (error) {
      throw new Error(`Failed to create post: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={resetForm}
        style={styles.header}
        disabled={uploading}
      >
        <Ionicons name="close-outline" size={24} color={COLORS.white} />
        <Text style={styles.headerTitle}>Add new post</Text>
        <TouchableOpacity onPress={handleShare} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color={COLORS.primaryLight} />
          ) : (
            <Text style={styles.shareButton}>Share</Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.contentContainer}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.selectedImage}
              resizeMode="cover"
            />
            <View style={styles.captionContainer}>
              <Image
                source={{ uri: user?.imageUrl }}
                style={styles.userAvatar}
              />
              <TextInput
                placeholder="what's on your mind..."
                placeholderTextColor={COLORS.textLight}
                value={caption}
                onChangeText={setCaption}
                style={styles.captionInput}
                multiline
                theme={{
                  colors: {
                    primary: COLORS.primaryLight,
                    text: COLORS.white,
                    placeholder: COLORS.textLight,
                  },
                }}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <MaterialIcons name="image" size={72} color={COLORS.white} />
            <Text style={styles.imagePickerText}>Select your image</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: "600",
    color: COLORS.white,
  },
  shareButton: {
    color: COLORS.primaryLight,
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: "100%",
    gap: 16,
  },
  selectedImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  captionContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  captionInput: {
    flex: 1,
    backgroundColor: "transparent",
    color: COLORS.white,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imagePickerText: {
    color: COLORS.white,
    marginTop: 8,
    fontSize: 16,
  },
});

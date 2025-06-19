// PostCreationScreen.tsx
import { useMutation, useStorageUpload } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  TextInput,
  View,
} from "react-native";

export default function PostCreationScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const createPost = useMutation(); // <-- Update this if your mutation is namespaced
  const generateUploadUrl = useStorageUpload();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) return Alert.alert("Please select an image");

    try {
      setUploading(true);

      // Upload to Convex Storage
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(image);
      const blob = await response.blob();

      const storageResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });

      const { storageId } = await storageResponse.json();

      // Create post via mutation
      await createPost({
        storageId,
        caption: caption.trim() || undefined,
      });

      Alert.alert("Post created successfully!");
      setImage(null);
      setCaption("");
    } catch (error) {
      console.error("Error uploading post:", error);
      Alert.alert("Failed to upload post.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 300, marginVertical: 10 }}
        />
      )}
      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Post" onPress={handleSubmit} />
      )}
    </View>
  );
}

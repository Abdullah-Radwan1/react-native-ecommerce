import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "./Loader";
import Comment from "./comment";

type commentsModal = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdd: () => void;
};

export default function CommentsModal({
  postId,
  onClose,
  visible,
  onCommentAdd,
}: commentsModal) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({ postId, comment: newComment });
      setNewComment("");
      onCommentAdd();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Comments</Text>
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            renderItem={({ item }) => <Comment comment={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.commentsList}
          />
        )}

<View style={styles.footer}>
  <TextInput
    placeholder="Share your thoughts "
    placeholderTextColor="#aaa"
    onChangeText={setNewComment}
    value={newComment}

    multiline
    style={styles.input}

  
  
  />
  <TouchableOpacity
    style={styles.postButton}
    onPress={handleAddComment}
    disabled={!newComment.trim()}
  >
    <Text style={styles.postButtonText}>Post</Text>
  </TouchableOpacity>
</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 12,
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    backgroundColor: COLORS.background,

  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  alignItems:"center",
    flexDirection:"row",
    gap:16
  },
  input: {
   borderColor:"#333",
    color: COLORS.white,
  flex:1,
  borderRadius:12,

    borderWidth:1,
   paddingLeft:22,
    alignContent:"center"
  },
  postButton: {
  

    borderRadius: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});